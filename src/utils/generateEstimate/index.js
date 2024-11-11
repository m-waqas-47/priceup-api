const {
  estimateCategory,
  showerGlassThicknessTypes,
  userRoles,
  mirrorGlassThicknessTypes,
} = require("@config/common");
const EstimateService = require("@services/estimate");
const HardwareService = require("@services/hardware");
const LayoutService = require("@services/layout");
const {
  getShowerHandleFabrication,
  getShowerHingeFabrication,
  getShowerMountingChannelFabrication,
  getShowerMountingClampFabrication,
  getShowerGenericFabrication,
} = require("@utils/generateEstimate/helpers/shower");
const GlassTypeService = require("@services/glassType");
const GlassAddonService = require("@services/glassAddon");
const { getCurrentFormattedDate } = require("@utils/common");
const {
  getGlassThickness,
  calculateAreaAndPerimeter,
} = require("@utils/generateEstimate/helpers/common");
const { default: mongoose } = require("mongoose");
const WineCellarLayoutService = require("@services/wineCellar/layout");
const WineCellarHardwareService = require("@services/wineCellar/hardware");
const {
  getWineCellarHandleFabrication,
  getWineCellarHingeFabrication,
  getWineCellarGenericFabrication,
} = require("./helpers/winecellar");
const WineCellarGlassTypeService = require("@services/wineCellar/glassType");
const MirrorGlassTypeService = require("@services/mirror/glassType");
const MirrorEdgeWorkService = require("@services/mirror/edgeWork");
const MirrorHardwareService = require("@services/mirror/hardware");
const { getAreaSqft } = require("./helpers/mirror");

exports.estimateSaveFormat = async (
  estimateData,
  companyData,
  creatorId,
  projectId
) => {
  try {
    let estimatePayload = null;
    if (estimateData?.category === estimateCategory.SHOWERS) {
      estimatePayload = await generateEstimatePayloadForShowers(
        estimateData,
        companyData,
        creatorId,
        projectId
      );
    } else if (estimateData?.category === estimateCategory.MIRRORS) {
      estimatePayload = await generateEstimatePayloadForMirrors(
        estimateData,
        companyData,
        creatorId,
        projectId
      );
    } else if (estimateData?.category === estimateCategory.WINECELLARS) {
      estimatePayload = await generateEstimatePayloadForWineCellars(
        estimateData,
        companyData,
        creatorId,
        projectId
      );
    }
    if (estimatePayload) {
      return EstimateService.create(estimatePayload);
    }
    return null;
  } catch (err) {
    throw err;
  }
};

const generateEstimatePayloadForShowers = async (
  estimateData,
  companyData,
  creatorId,
  projectId
) => {
  try {
    const layout = await LayoutService.findBy({ _id: estimateData.layout._id });
    const glassThickness = getGlassThickness(
      estimateData.layout.variant,
      estimateData.estimateDetail.dimensions,
      layout?.settings?.heavyDutyOption?.height || 85
    );
    const result = calculateAreaAndPerimeter(
      estimateData.estimateDetail.dimensions,
      layout?.settings?.variant,
      glassThickness
    );
    // getting selected items of layout from DB
    const config = {};
    let oneInchHoles = 0;
    let hingeCut = 0;
    let clampCut = 0;
    let notch = 0;
    let outages = 0;
    let hardwarePrice = 0;
    let glassPrice = 0;
    let glassAddonPrice = 0;
    config.doorWidth = result.doorWidth;
    config.isCustomizedDoorWidth = false;
    config.additionalFields = [];
    config.hardwareFinishes = estimateData.estimateDetail.hardware._id ?? null;
    const handle = await HardwareService.findBy({
      _id: estimateData.estimateDetail.handle._id,
    });
    if (handle) {
      const fabrication = getShowerHandleFabrication(
        handle,
        layout?.settings?.handles?.count ?? 0
      );
      oneInchHoles += fabrication.oneInchHoles;
      hingeCut += fabrication.hingeCut;
      clampCut += fabrication.clampCut;
      notch += fabrication.notch;
      outages += fabrication.outages;
      const handlePrice =
        (handle?.finishes?.find((item) =>
          new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
            item.finish_id
          )
        )?.cost || 0) * (layout?.settings?.handles?.count || 0);
      hardwarePrice += handlePrice;
    }
    config.handles = {
      type: handle?._id ?? null,
      count: handle ? layout?.settings?.handles?.count : 0,
    };
    const hinge = await HardwareService.findBy({
      _id: estimateData.estimateDetail.hinge._id,
    });
    if (hinge) {
      const fabrication = getShowerHingeFabrication(
        hinge,
        layout?.settings?.hinges?.count ?? 0
      );
      oneInchHoles += fabrication.oneInchHoles;
      hingeCut += fabrication.hingeCut;
      clampCut += fabrication.clampCut;
      notch += fabrication.notch;
      outages += fabrication.outages;
      const hingePrice =
        (hinge?.finishes?.find((item) =>
          new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
            item.finish_id
          )
        )?.cost || 0) * (layout?.settings?.hinges?.count || 0);
      hardwarePrice += hingePrice;
    }
    config.hinges = {
      type: hinge?._id ?? null,
      count: hinge ? layout?.settings?.hinges?.count : 0,
    };
    let cornerWallClamp = [];
    if (layout?.settings?.cornerWallClamp?.wallClampType) {
      const cornerWallClampRecord = await HardwareService.findBy({
        _id: layout?.settings?.cornerWallClamp?.wallClampType,
      });
      if (cornerWallClampRecord) {
        cornerWallClamp = [
          {
            type: cornerWallClampRecord?._id,
            count: layout?.settings?.cornerWallClamp?.count,
          },
        ];
        const fabrication = getShowerMountingClampFabrication(
          cornerWallClampRecord,
          layout?.settings?.cornerWallClamp?.count ?? 0
        );
        oneInchHoles += fabrication.oneInchHoles;
        hingeCut += fabrication.hingeCut;
        clampCut += fabrication.clampCut;
        notch += fabrication.notch;
        outages += fabrication.outages;
        const cornerWallClampPrice =
          (cornerWallClampRecord?.finishes?.find((item) =>
            new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
              item.finish_id
            )
          )?.cost || 0) * (layout?.settings?.cornerWallClamp?.count || 0);
        hardwarePrice += cornerWallClampPrice;
      }
    }
    let cornerSleeveOver = [];
    if (layout?.settings?.cornerSleeveOver?.sleeveOverType) {
      const cornerSleeveOverRecord = await HardwareService.findBy({
        _id: layout?.settings?.cornerSleeveOver?.sleeveOverType,
      });
      if (cornerSleeveOverRecord) {
        cornerSleeveOver = [
          {
            type: cornerSleeveOverRecord?._id,
            count: layout?.settings?.cornerSleeveOver?.count,
          },
        ];
        const fabrication = getShowerMountingClampFabrication(
          cornerSleeveOverRecord,
          layout?.settings?.cornerSleeveOver?.count ?? 0
        );
        oneInchHoles += fabrication.oneInchHoles;
        hingeCut += fabrication.hingeCut;
        clampCut += fabrication.clampCut;
        notch += fabrication.notch;
        outages += fabrication.outages;
        const cornerSleeveOverPrice =
          (cornerSleeveOverRecord?.finishes?.find(
            (item) => config.hardwareFinishes === item.finish_id
          )?.cost || 0) * layout?.settings?.cornerSleeveOver?.count;
        hardwarePrice += cornerSleeveOverPrice;
      }
    }
    let cornerGlassToGlass = [];
    if (layout?.settings?.cornerGlassToGlass?.glassToGlassType) {
      const cornerGlassToGlassRecord = await HardwareService.findBy({
        _id: layout?.settings?.cornerGlassToGlass?.glassToGlassType,
      });
      if (cornerGlassToGlassRecord) {
        cornerGlassToGlass = [
          {
            type: cornerGlassToGlassRecord?._id,
            count: layout?.settings?.cornerGlassToGlass?.count,
          },
        ];
        const fabrication = getShowerMountingClampFabrication(
          cornerGlassToGlassRecord,
          layout?.settings?.cornerGlassToGlass?.count ?? 0
        );
        oneInchHoles += fabrication.oneInchHoles;
        hingeCut += fabrication.hingeCut;
        clampCut += fabrication.clampCut;
        notch += fabrication.notch;
        outages += fabrication.outages;
        const cornerGlassToGlassPrice =
          (cornerGlassToGlassRecord?.finishes?.find((item) =>
            new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
              item.finish_id
            )
          )?.cost || 0) * (layout?.settings?.cornerGlassToGlass?.count || 0);
        hardwarePrice += cornerGlassToGlassPrice;
      }
    }
    config.cornerClamps = {
      wallClamp: cornerWallClamp,
      sleeveOver: cornerSleeveOver,
      glassToGlass: cornerGlassToGlass,
    };
    if (layout.settings?.channelOrClamps === "Channel") {
      if (layout?.settings?.mountingChannel) {
        const mountingChannel = await HardwareService.findBy({
          _id: layout?.settings?.mountingChannel,
        });
        if (mountingChannel) {
          const fabrication = getShowerMountingChannelFabrication(
            mountingChannel,
            1
          );
          oneInchHoles += fabrication.oneInchHoles;
          hingeCut += fabrication.hingeCut;
          clampCut += fabrication.clampCut;
          notch += fabrication.notch;
          outages += fabrication.outages;
          const mountingChannelPrice =
            mountingChannel?.finishes?.find((item) =>
              new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
                item.finish_id
              )
            )?.cost || 0;
          hardwarePrice += mountingChannelPrice;
        }
      }
      config.mountingChannel = layout?.settings?.mountingChannel ?? null;
      config.mountingClamps = {
        wallClamp: [],
        sleeveOver: [],
        glassToGlass: [],
      };
    } else if (layout.settings?.channelOrClamps === "Clamps") {
      config.mountingChannel = null;
      let wallClamp = [];
      if (layout?.settings?.wallClamp?.wallClampType) {
        const wallClampRecord = await HardwareService.findBy({
          _id: layout?.settings?.wallClamp?.wallClampType,
        });
        if (wallClampRecord) {
          wallClamp = [
            {
              type: wallClampRecord?._id,
              count: layout?.settings?.wallClamp?.count,
            },
          ];
          const fabrication = getShowerMountingClampFabrication(
            wallClampRecord,
            layout?.settings?.wallClamp?.count ?? 0
          );
          oneInchHoles += fabrication.oneInchHoles;
          hingeCut += fabrication.hingeCut;
          clampCut += fabrication.clampCut;
          notch += fabrication.notch;
          outages += fabrication.outages;
          const wallClampPrice =
            (wallClampRecord?.finishes?.find((item) =>
              new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
                item.finish_id
              )
            )?.cost || 0) * (layout?.settings?.wallClamp?.count || 0);
          hardwarePrice += wallClampPrice;
        }
      }
      let sleeveOver = [];
      if (layout?.settings?.sleeveOver?.sleeveOverType) {
        const sleeveOverRecord = await HardwareService.findBy({
          _id: layout?.settings?.sleeveOver?.sleeveOverType,
        });
        if (sleeveOverRecord) {
          sleeveOver = [
            {
              type: sleeveOverRecord?._id,
              count: layout?.settings?.sleeveOver?.count,
            },
          ];
          const fabrication = getShowerGenericFabrication(
            sleeveOverRecord,
            layout?.settings?.sleeveOver?.count ?? 0
          );
          oneInchHoles += fabrication.oneInchHoles;
          hingeCut += fabrication.hingeCut;
          clampCut += fabrication.clampCut;
          notch += fabrication.notch;
          outages += fabrication.outages;
          const sleeveOverPrice =
            (sleeveOverRecord?.finishes?.find((item) =>
              new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
                item.finish_id
              )
            )?.cost || 0) * (layout?.settings?.sleeveOver?.count || 0);
          hardwarePrice += sleeveOverPrice;
        }
      }
      let glassToGlass = [];
      if (layout?.settings?.glassToGlass?.glassToGlassType) {
        const glassToGlassRecord = await HardwareService.findBy({
          _id: layout?.settings?.glassToGlass?.glassToGlassType,
        });
        if (glassToGlassRecord) {
          glassToGlass = [
            {
              type: glassToGlassRecord?._id,
              count: layout?.settings?.glassToGlass?.count,
            },
          ];
          const fabrication = getShowerMountingClampFabrication(
            glassToGlassRecord,
            layout?.settings?.glassToGlass?.count ?? 0
          );
          oneInchHoles += fabrication.oneInchHoles;
          hingeCut += fabrication.hingeCut;
          clampCut += fabrication.clampCut;
          notch += fabrication.notch;
          outages += fabrication.outages;
          const glassToGlassPrice =
            (glassToGlassRecord?.finishes?.find((item) =>
              new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
                item.finish_id
              )
            )?.cost || 0) * (layout?.settings?.glassToGlass?.count || 0);
          hardwarePrice += glassToGlassPrice;
        }
      }
      config.mountingClamps = {
        wallClamp: wallClamp,
        sleeveOver: sleeveOver,
        glassToGlass: glassToGlass,
      };
    }
    const glassType = await GlassTypeService.findBy({
      _id: estimateData.estimateDetail.glass._id,
    });
    if (glassType) {
      glassPrice =
        (glassType?.options?.find((glass) => glass.thickness === glassThickness)
          ?.cost || 0) * result.areaSqft;
    }
    config.glassType = {
      type: estimateData.estimateDetail.glass._id,
      thickness: glassThickness,
    };
    let slidingDoorSystemId = null;
    if (layout?.settings?.slidingDoorSystem?.type) {
      const slidingDoorSystemRecord = await HardwareService.findBy({
        _id: layout?.settings?.slidingDoorSystem?.type,
      });
      if (slidingDoorSystemRecord) {
        slidingDoorSystemId = slidingDoorSystemRecord._id;
        const fabrication = getShowerGenericFabrication(
          slidingDoorSystemRecord,
          layout?.settings?.slidingDoorSystem?.count ?? 0
        );
        oneInchHoles += fabrication.oneInchHoles;
        hingeCut += fabrication.hingeCut;
        clampCut += fabrication.clampCut;
        notch += fabrication.notch;
        outages += fabrication.outages;
        const slidingDoorSystemPrice =
          (slidingDoorSystemRecord?.finishes?.find(
            (item) => config.hardwareFinishes === item.finish_id
          )?.cost || 0) * (layout?.settings?.slidingDoorSystem?.count || 0);
        hardwarePrice += slidingDoorSystemPrice;
      }
    }
    config.slidingDoorSystem = {
      type: slidingDoorSystemId,
      count: slidingDoorSystemId
        ? layout?.settings?.slidingDoorSystem?.count
        : 0,
    };
    let headerId = null;
    if (layout?.settings?.header) {
      const headerRecord = await HardwareService.findBy({
        _id: layout?.settings?.header,
      });
      if (headerRecord) {
        headerId = headerRecord._id;
        const fabrication = getShowerGenericFabrication(headerRecord, 1);
        oneInchHoles += fabrication.oneInchHoles;
        hingeCut += fabrication.hingeCut;
        clampCut += fabrication.clampCut;
        notch += fabrication.notch;
        outages += fabrication.outages;
        const headerPrice =
          (headerRecord?.finishes?.find((item) =>
            new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
              item.finish_id
            )
          )?.cost || 0) * 1;
        hardwarePrice += headerPrice;
      }
    }

    config.header = {
      type: headerId,
      count: headerId ? 1 : 0,
    };
    if (layout?.settings?.notch && layout?.settings?.notch > 0) {
      notch += layout?.settings?.notch;
    }
    if (layout?.settings?.outages && layout?.settings?.outages > 0) {
      outages += layout?.settings?.outages;
    }
    if (layout?.settings?.glassAddon) {
      const glassAddon = await GlassAddonService.findBy({
        _id: layout?.settings?.glassAddon,
      });
      if (glassAddon) {
        glassAddonPrice = (glassAddon?.options[0]?.cost || 0) * result.areaSqft;
      }
    }

    config.glassAddons = layout?.settings?.glassAddon
      ? [layout?.settings?.glassAddon]
      : [];
    config.people = layout?.settings?.other?.people ?? 0;
    config.hours = layout?.settings?.other?.hours ?? 0;
    config.userProfitPercentage = 0;
    config.hardwareAddons = [];
    config.measurements = estimateData.estimateDetail.dimensions;
    config.perimeter = result.perimeter;
    config.sqftArea = result.areaSqft;
    config.polish = result.perimeter;
    config.mitre = 0;
    config.layout_id = layout?._id;
    config.oneInchHoles = oneInchHoles;
    config.hingeCut = hingeCut;
    config.clampCut = clampCut;
    config.notch = notch;
    config.outages = outages;

    let fabricationPrice = 0;
    if (glassThickness === showerGlassThicknessTypes.ONEBYTWO) {
      fabricationPrice =
        Number(config.oneInchHoles ?? 0) *
          (companyData?.showers?.fabricatingPricing?.oneHoleOneByTwoInchGlass ??
            0) +
        Number(config.hingeCut ?? 0) *
          (companyData?.showers?.fabricatingPricing?.hingeCutoutOneByTwoInch ??
            0) +
        Number(config.clampCut ?? 0) *
          (companyData?.showers?.fabricatingPricing?.clampCutoutOneByTwoInch ??
            0) +
        Number(config.notch ?? 0) *
          (companyData?.showers?.fabricatingPricing?.notchOneByTwoInch ?? 0) +
        Number(config.outages ?? 0) *
          (companyData?.showers?.fabricatingPricing?.outageOneByTwoInch ?? 0) +
        Number(config.mitre ?? 0) *
          (companyData?.showers?.fabricatingPricing?.miterOneByTwoInch ?? 0) +
        Number(config.polish ?? 0) *
          (companyData?.showers?.fabricatingPricing
            ?.polishPricePerOneByTwoInch ?? 0);
    } else if (glassThickness === showerGlassThicknessTypes.THREEBYEIGHT) {
      fabricationPrice =
        Number(config.oneInchHoles ?? 0) *
          (companyData?.showers?.fabricatingPricing
            ?.oneHoleThreeByEightInchGlass ?? 0) +
        Number(config.hingeCut ?? 0) *
          (companyData?.showers?.fabricatingPricing
            ?.hingeCutoutThreeByEightInch ?? 0) +
        Number(config.clampCut ?? 0) *
          (companyData?.showers?.fabricatingPricing
            ?.clampCutoutThreeByEightInch ?? 0) +
        Number(config.notch ?? 0) *
          (companyData?.showers?.fabricatingPricing?.notchThreeByEightInch ??
            0) +
        Number(config.outages ?? 0) *
          (companyData?.showers?.fabricatingPricing?.outageThreeByEightInch ??
            0) +
        Number(config.mitre ?? 0) *
          (companyData?.showers?.fabricatingPricing?.miterThreeByEightInch ??
            0) +
        Number(config.polish ?? 0) *
          (companyData?.showers?.fabricatingPricing
            ?.polishPricePerThreeByEightInch ?? 0);
    }
    const laborPrice =
      config.people *
      config.hours *
      (companyData?.showers?.miscPricing?.hourlyRate ?? 0);
    const total =
      (hardwarePrice + fabricationPrice + glassPrice + glassAddonPrice) *
        (companyData?.showers?.miscPricing?.pricingFactorStatus
          ? companyData?.showers?.miscPricing?.pricingFactor
          : 1) +
      laborPrice;

    return {
      config,
      cost: total,
      creator_id: creatorId,
      creator_type: userRoles.ADMIN,
      status: "pending",
      category: estimateCategory.SHOWERS,
      name: getCurrentFormattedDate(),
      label: "Estimate created from customer form",
      project_id: projectId,
      company_id: companyData?._id,
    };
  } catch (err) {
    throw err;
  }
};

const generateEstimatePayloadForMirrors = async (estimateData,companyData,creatorId,projectId) => {
  try {
  
    const glassThickness = mirrorGlassThicknessTypes.ONEBYFOUR;
    const result = getAreaSqft(
      estimateData.estimateDetail.dimensions
    );
    // getting selected items of layout from DB
    const config = {};
    let glassPrice = 0;
    let edgeWorkPrice = 0;
    let glassAddonsPrice = 0;
    let hardwarePrice = 0; 
   let fabricationPrice = 0;
    const glass = await MirrorGlassTypeService.findBy({
      _id: estimateData.estimateDetail.glass._id,
    });
    if (glass) {
      glassPrice =
      (glass?.options?.find(
        (glass) => glass.thickness === glassThickness
      )?.cost || 0) * result.areaSqft;
    }
    config.glassType = {
      type: glass?._id ?? null,
      thickness: mirrorGlassThicknessTypes.ONEBYFOUR,
    };
    const edgeWork = await MirrorEdgeWorkService.findBy({
      _id: estimateData.estimateDetail.edgeWork._id,
    });
    if (edgeWork) {
      const edgeWorkCost =
      edgeWork?.options?.find(
        (polish) => polish.thickness === glassThickness
      )?.cost || 0;
      estimateData.estimateDetail.dimensions?.forEach(dimension => {
      const count = dimension.count;
      const width = dimension.width;
      const height = dimension.height;
      for (let i = 0; i < count; i++) {
        const value = edgeWorkCost * (width * 2 + height * 2) * 1;
        edgeWorkPrice += value;
      }
    });
    }
    config.edgeWork = {
      type: edgeWork?._id ?? null,
      thickness: mirrorGlassThicknessTypes.ONEBYFOUR,
    };
    config.glassAddons = [];
    if(estimateData.estimateDetail?.hardware?._id){
      const hardware = await MirrorHardwareService.findBy({
        _id: estimateData.estimateDetail.hardware._id,
      });
      if (hardware) {
        const price = hardware?.options[0]?.cost || 0;
        hardwarePrice = price * 1;
      }
      config.hardwares = [{
        type: hardware ?? null,
        count: hardware ? 1 : 0,
      }];
    }else{
       config.hardwares = [];
    }
    const simpleHoles = estimateData.estimateDetail?.simpleHoles > 0 ? estimateData.estimateDetail?.simpleHoles : 0;
    const lightHoles = estimateData.estimateDetail?.lightHoles > 0 ? estimateData.estimateDetail.lightHoles : 0;
    const singleOutletCutout = estimateData.estimateDetail?.singleOutletCutout > 0 ? estimateData.estimateDetail.singleOutletCutout : 0;
    config.simpleHoles = simpleHoles;
    config.lightHoles = lightHoles;
    config.notch = 0;
    config.singleOutletCutout = singleOutletCutout;
    config.doubleOutletCutout = 0;
    config.tripleOutletCutout = 0;
    config.quadOutletCutout = 0;
    config.modifiedProfitPercentage = 0;
    config.additionalFields = [];
    config.people = 0;
    config.hours = 0;
    config.measurements = estimateData.estimateDetail.dimensions;
    // config.perimeter = result.perimeter;
    config.sqftArea = result.areaSqft;
    config.layout_id = null;

  fabricationPrice =
  simpleHoles * (companyData?.mirrors?.holeMultiplier ?? 0) +
  lightHoles * (companyData?.mirrors?.lightHoleMultiplier ?? 0) +
  singleOutletCutout *
      (companyData?.mirrors?.singleOutletCutoutMultiplier ?? 0);
    
    fabricationPrice +=
    edgeWorkPrice +
    glassAddonsPrice +
    hardwarePrice;

    const laborPrice =
      config.people *
      config.hours *
      (companyData?.mirrors?.hourlyRate ?? 0);
    
    const totalPrice =
    (glassPrice + fabricationPrice) *
      (companyData?.mirrors?.pricingFactorStatus
        ? companyData?.mirrors?.pricingFactor
        : 1) +
    laborPrice;
    
    return {
      config,
      cost: totalPrice,
      creator_id: creatorId,
      creator_type: userRoles.ADMIN,
      status: "pending",
      category: estimateCategory.MIRRORS,
      name: getCurrentFormattedDate(),
      label: "Estimate created from customer form",
      project_id: projectId,
      company_id: companyData?._id,
    };
  } catch (err) {
    throw err;
  }
};

const generateEstimatePayloadForWineCellars = async (
  estimateData,
  companyData,
  creatorId,
  projectId
) => {
  try {
    const layout = await WineCellarLayoutService.findBy({
      _id: estimateData.layout._id,
    });
    const glassThickness = getGlassThickness(
      estimateData.layout.variant,
      estimateData.estimateDetail.dimensions,
      layout?.settings?.heavyDutyOption?.height || 85
    );
    const result = calculateAreaAndPerimeter(
      estimateData.estimateDetail.dimensions,
      layout?.settings?.variant,
      glassThickness,
      { doorQuantity: 1 }
    );
    // getting selected items of layout from DB
    const config = {};
    let oneInchHoles = 0;
    let hingeCut = 0;
    let hardwarePrice = 0;
    let glassPrice = 0;
    let glassAddonPrice = 0;
    config.doorWidth = result.doorWidth;
    config.doorQuantity = 1;
    config.isCustomizedDoorWidth = false;
    config.additionalFields = [];
    config.hardwareFinishes = estimateData.estimateDetail.hardware._id ?? null;
    const handle = await WineCellarHardwareService.findBy({
      _id: estimateData.estimateDetail.handle._id,
    });
    if (handle) {
      const fabrication = getWineCellarHandleFabrication(
        handle,
        layout?.settings?.handles?.count ?? 0
      );
      oneInchHoles += fabrication.oneInchHoles;
      hingeCut += fabrication.hingeCut;
      const handlePrice =
        (handle?.finishes?.find((item) =>
          new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
            item.finish_id
          )
        )?.cost || 0) * (layout?.settings?.handles?.count || 0);
      hardwarePrice += handlePrice;
    }
    config.handles = {
      type: handle?._id ?? null,
      count: handle ? layout?.settings?.handles?.count : 0,
    };
    const hinge = await WineCellarHardwareService.findBy({
      _id: estimateData.estimateDetail.hinge._id,
    });
    if (hinge) {
      const fabrication = getWineCellarHingeFabrication(
        hinge,
        layout?.settings?.hinges?.count ?? 0
      );
      oneInchHoles += fabrication.oneInchHoles;
      hingeCut += fabrication.hingeCut;
      const hingePrice =
        (hinge?.finishes?.find((item) =>
          new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
            item.finish_id
          )
        )?.cost || 0) * (layout?.settings?.hinges?.count || 0);
      hardwarePrice += hingePrice;
    }
    config.hinges = {
      type: hinge?._id ?? null,
      count: hinge ? layout?.settings?.hinges?.count : 0,
    };
    if (estimateData.estimateDetail?.lock === "with-lock" && layout?.settings?.doorLock?.type) {
      const doorLock = await WineCellarHardwareService.findBy({
        _id: layout?.settings?.doorLock?.type,
      });
      if (doorLock) {
        const fabrication = getWineCellarGenericFabrication(doorLock, layout?.settings?.doorLock?.count);
        oneInchHoles += fabrication.oneInchHoles;
        hingeCut += fabrication.hingeCut;
        const doorLockPrice =
          (doorLock?.finishes?.find((item) =>
            new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
              item.finish_id
            )
          )?.cost || 0) * 1;
        hardwarePrice += doorLockPrice;
      }
      config.doorLock = {
        type: doorLock?._id ?? null,
        count: doorLock ? layout?.settings?.doorLock?.count : 0,
      };
    } else {
      config.doorLock = {
        type: null,
        count: 0,
      };
    }

    if (layout.settings?.channelOrClamps === "Channel") {
      if (layout?.settings?.mountingChannel) {
        const mountingChannel = await WineCellarHardwareService.findBy({
          _id: layout?.settings?.mountingChannel,
        });
        if (mountingChannel) {
          const fabrication = getWineCellarGenericFabrication(
            mountingChannel,
            1
          );
          oneInchHoles += fabrication.oneInchHoles;
          hingeCut += fabrication.hingeCut;
          const mountingChannelPrice =
            mountingChannel?.finishes?.find((item) =>
              new mongoose.Types.ObjectId(config.hardwareFinishes).equals(
                item.finish_id
              )
            )?.cost || 0;
          hardwarePrice += mountingChannelPrice;
        }
      }
      config.mountingChannel = layout?.settings?.mountingChannel ?? null;
    }
    const glassType = await WineCellarGlassTypeService.findBy({
      _id: estimateData.estimateDetail.glass._id,
    });
    if (glassType) {
      glassPrice =
        (glassType?.options?.find((glass) => glass.thickness === glassThickness)
          ?.cost || 0) * result.areaSqft;
    }
    config.glassType = {
      type: estimateData.estimateDetail.glass._id,
      thickness: glassThickness,
    };

    // if (layout?.settings?.glassAddon) {
    //   const glassAddon = await GlassAddonService.findBy({
    //     _id: layout?.settings?.glassAddon,
    //   });
    //   if (glassAddon) {
    //     glassAddonPrice = (glassAddon?.options[0]?.cost || 0) * result.areaSqft;
    //   }
    // }

    // config.glassAddons = layout?.settings?.glassAddon
    //   ? [layout?.settings?.glassAddon]
    //   : [];
    config.people = layout?.settings?.other?.people ?? 0;
    config.hours = layout?.settings?.other?.hours ?? 0;
    config.userProfitPercentage = 0;
    config.laborHoursForDoor =
      1 * (layout?.settings?.noOfHoursToCompleteSingleDoor || 0);
    config.measurements = estimateData.estimateDetail.dimensions;
    config.perimeter = result.perimeter;
    config.sqftArea = result.areaSqft;
    config.layout_id = layout?._id;
    config.oneInchHoles = oneInchHoles;
    config.hingeCut = hingeCut;

    let fabricationPrice = 0;
    if (glassThickness === showerGlassThicknessTypes.ONEBYTWO) {
      fabricationPrice =
        Number(config.oneInchHoles ?? 0) *
          (companyData?.wineCellars?.fabricatingPricing
            ?.oneHoleOneByTwoInchGlass ?? 0) +
        Number(config.hingeCut ?? 0) *
          (companyData?.wineCellars?.fabricatingPricing
            ?.hingeCutoutOneByTwoInch ?? 0);
    } else if (glassThickness === showerGlassThicknessTypes.THREEBYEIGHT) {
      fabricationPrice =
        Number(config.oneInchHoles ?? 0) *
          (companyData?.wineCellars?.fabricatingPricing
            ?.oneHoleThreeByEightInchGlass ?? 0) +
        Number(config.hingeCut ?? 0) *
          (companyData?.wineCellars?.fabricatingPricing
            ?.hingeCutoutThreeByEightInch ?? 0);
    }
    const laborPrice =
      config.people *
      config.hours *
      (companyData?.wineCellars?.miscPricing?.hourlyRate ?? 0);
    const total =
      (hardwarePrice + fabricationPrice + glassPrice + glassAddonPrice) *
        (companyData?.wineCellars?.miscPricing?.pricingFactorStatus
          ? companyData?.wineCellars?.miscPricing?.pricingFactor
          : 1) +
      laborPrice;
    console.log(hardwarePrice,fabricationPrice,glassPrice,glassAddonPrice,(companyData?.wineCellars?.miscPricing?.pricingFactorStatus
      ? companyData?.wineCellars?.miscPricing?.pricingFactor
      : 1),laborPrice,'all prices');
    return {
      config,
      cost: total,
      creator_id: creatorId,
      creator_type: userRoles.ADMIN,
      status: "pending",
      category: estimateCategory.WINECELLARS,
      name: getCurrentFormattedDate(),
      label: "Estimate created from customer form",
      project_id: projectId,
      company_id: companyData?._id,
    };
  } catch (err) {
    throw err;
  }
};
