const FinishService = require("@services/finish");
const mongoose = require("mongoose");
const HardwareService = require("@services/hardware");
const GlassTypeService = require("@services/glassType");
const GlassAddonService = require("@services/glassAddon");
const WineCellarFinishService = require("@services/wineCellar/finish");
const WineCellarHardwareService = require("@services/wineCellar/hardware");
const WineCellarGlassTypeService = require("@services/wineCellar/glassType");
exports.generateLayoutSettings = (settings, companyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            if (settings?.hardwareFinishes) {
                // finishes
                const finish = await FinishService.findBy({
                    slug: settings?.hardwareFinishes,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    hardwareFinishes: finish._id,
                };
            }
            if (settings?.handles && settings?.handles?.handleType) {
                // handles
                const handle = await HardwareService.findBy({
                    slug: settings?.handles?.handleType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    handles: {
                        handleType: new mongoose.Types.ObjectId(handle.id),
                        count: settings?.handles?.count,
                    },
                };
            }
            if (settings?.hinges && settings?.hinges?.hingesType) {
                // hinges
                const hinge = await HardwareService.findBy({
                    slug: settings?.hinges?.hingesType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    hinges: {
                        hingesType: new mongoose.Types.ObjectId(hinge?.id),
                        count: settings?.hinges?.count,
                    },
                };
            }
            if (
                settings?.pivotHingeOption &&
                settings?.pivotHingeOption?.pivotHingeType
            ) {
                // pivotHingeOption
                const pivotHinge = await HardwareService.findBy({
                    slug: settings?.pivotHingeOption?.pivotHingeType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    pivotHingeOption: {
                        pivotHingeType: new mongoose.Types.ObjectId(pivotHinge?.id),
                        count: settings?.pivotHingeOption?.count,
                    },
                };
            }
            if (
                settings?.heavyDutyOption &&
                settings?.heavyDutyOption?.heavyDutyType
            ) {
                // heavyDutyOption
                const heavyDutyType = await HardwareService.findBy({
                    slug: settings?.heavyDutyOption?.heavyDutyType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    heavyDutyOption: {
                        heavyDutyType: new mongoose.Types.ObjectId(heavyDutyType?.id),
                        threshold: settings?.heavyDutyOption?.threshold,
                        height: settings?.heavyDutyOption?.height,
                    },
                };
            }
            if (
                settings?.heavyPivotOption &&
                settings?.heavyPivotOption?.heavyPivotType
            ) {
                // heavyPivotOption
                const heavyPivotType = await HardwareService.findBy({
                    slug: settings?.heavyPivotOption?.heavyPivotType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    heavyPivotOption: {
                        heavyPivotType: new mongoose.Types.ObjectId(heavyPivotType?.id),
                        threshold: settings?.heavyPivotOption?.threshold,
                        height: settings?.heavyPivotOption?.height,
                    },
                };
            }
            if (settings?.channelOrClamps) {
                // channelOrClamps
                result = { ...result, channelOrClamps: settings?.channelOrClamps };
            }
            if (settings?.mountingChannel) {
                // mountingChannel
                const mountingChannel = await HardwareService.findBy({
                    slug: settings?.mountingChannel,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    mountingChannel: new mongoose.Types.ObjectId(mountingChannel?.id),
                };
            }
            if (settings?.wallClamp && settings?.wallClamp?.wallClampType) {
                // wallClamp
                const wallClampType = await HardwareService.findBy({
                    slug: settings?.wallClamp?.wallClampType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    wallClamp: {
                        wallClampType: new mongoose.Types.ObjectId(wallClampType?.id),
                        count: settings?.wallClamp?.count,
                    },
                };
            }
            if (settings?.sleeveOver && settings?.sleeveOver?.sleeveOverType) {
                // sleeveOver
                const sleeveOverType = await HardwareService.findBy({
                    slug: settings?.sleeveOver?.sleeveOverType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    sleeveOver: {
                        sleeveOverType: new mongoose.Types.ObjectId(sleeveOverType?.id),
                        count: settings?.sleeveOver?.count,
                    },
                };
            }
            if (settings?.glassToGlass && settings?.glassToGlass?.glassToGlassType) {
                // glassToGlass
                const glassToGlassType = await HardwareService.findBy({
                    slug: settings?.glassToGlass?.glassToGlassType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    glassToGlass: {
                        glassToGlassType: new mongoose.Types.ObjectId(glassToGlassType?.id),
                        count: settings?.glassToGlass?.count,
                    },
                };
            }
            if (
                settings?.cornerWallClamp &&
                settings?.cornerWallClamp?.wallClampType
            ) {
                // wallClamp
                const wallClampType = await HardwareService.findBy({
                    slug: settings?.cornerWallClamp?.wallClampType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    cornerWallClamp: {
                        wallClampType: new mongoose.Types.ObjectId(wallClampType?.id),
                        count: settings?.cornerWallClamp?.count,
                    },
                };
            }
            if (
                settings?.cornerSleeveOver &&
                settings?.cornerSleeveOver?.sleeveOverType
            ) {
                // sleeveOver
                const sleeveOverType = await HardwareService.findBy({
                    slug: settings?.cornerSleeveOver?.sleeveOverType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    cornerSleeveOver: {
                        sleeveOverType: new mongoose.Types.ObjectId(sleeveOverType?.id),
                        count: settings?.cornerSleeveOver?.count,
                    },
                };
            }
            if (
                settings?.cornerGlassToGlass &&
                settings?.cornerGlassToGlass?.glassToGlassType
            ) {
                // glassToGlass
                const glassToGlassType = await HardwareService.findBy({
                    slug: settings?.cornerGlassToGlass?.glassToGlassType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    cornerGlassToGlass: {
                        glassToGlassType: new mongoose.Types.ObjectId(glassToGlassType?.id),
                        count: settings?.cornerGlassToGlass?.count,
                    },
                };
            }
            if (settings?.glassType && settings?.glassType?.type) {
                // glassType
                const glassType = await GlassTypeService.findBy({
                    slug: settings?.glassType?.type,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    glassType: {
                        type: new mongoose.Types.ObjectId(glassType?.id),
                        thickness: settings?.glassType?.thickness,
                    },
                };
            }
            if (settings?.slidingDoorSystem && settings?.slidingDoorSystem?.type) {
                // slidingDoorSystem
                const slidingDoorSystem = await HardwareService.findBy({
                    slug: settings?.slidingDoorSystem?.type,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    slidingDoorSystem: {
                        type: new mongoose.Types.ObjectId(slidingDoorSystem?.id),
                        count: settings?.slidingDoorSystem?.count,
                    },
                };
            }
            if (settings?.outages) {
                // outages
                result = { ...result, outages: settings?.outages };
            }
            if (settings?.notch) {
                // notch
                result = { ...result, notch: settings?.notch };
            }
            if (settings?.transom) {
                // transom
                const transom = await HardwareService.findBy({
                    slug: settings?.transom,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    transom: new mongoose.Types.ObjectId(transom?.id),
                };
            }
            if (settings?.header) {
                // header
                const header = await HardwareService.findBy({
                    slug: settings?.header,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    header: new mongoose.Types.ObjectId(header?.id),
                };
            }
            if (settings?.glassAddon) {
                // glassAddon
                const glassAddon = await GlassAddonService.findBy({
                    slug: settings?.glassAddon,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    glassAddon: new mongoose.Types.ObjectId(glassAddon?.id),
                };
            }
            // measurement Sides
            if (settings?.measurementSides) {
                result = {
                    ...result,
                    measurementSides: settings?.measurementSides,
                };
            }
            // measurement Sides
            if (settings?.variant) {
                result = {
                    ...result,
                    variant: settings?.variant,
                };
            }
            // area by sqft formula
            if (settings?.priceBySqftFormula) {
                result = {
                    ...result,
                    priceBySqftFormula: settings?.priceBySqftFormula,
                };
            }
            // permieter formula
            if (settings?.perimeterFormula) {
                result = {
                    ...result,
                    perimeterFormula: settings?.perimeterFormula,
                };
            }
            if (settings?.other) {
                // other
                result = {
                    ...result,
                    other: {
                        people: settings?.other?.people,
                        hours: settings?.other?.hours,
                    },
                };
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};

exports.generateLayoutSettingsForWineCellar = (settings, companyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};
            if (settings?.hardwareFinishes) {
                // finishes
                const finish = await WineCellarFinishService.findBy({
                    slug: settings?.hardwareFinishes,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    hardwareFinishes: finish._id,
                };
            }
            if (settings?.handles && settings?.handles?.handleType) {
                // handles
                const handle = await WineCellarHardwareService.findBy({
                    slug: settings?.handles?.handleType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    handles: {
                        handleType: new mongoose.Types.ObjectId(handle.id),
                        count: settings?.handles?.count,
                    },
                };
            }
            if (settings?.hinges && settings?.hinges?.hingesType) {
                // hinges
                const hinge = await WineCellarHardwareService.findBy({
                    slug: settings?.hinges?.hingesType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    hinges: {
                        hingesType: new mongoose.Types.ObjectId(hinge?.id),
                        count: settings?.hinges?.count,
                    },
                };
            }
            if (
                settings?.heavyDutyOption &&
                settings?.heavyDutyOption?.heavyDutyType
            ) {
                // heavyDutyOption
                const heavyDutyType = await WineCellarHardwareService.findBy({
                    slug: settings?.heavyDutyOption?.heavyDutyType,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    heavyDutyOption: {
                        heavyDutyType: new mongoose.Types.ObjectId(heavyDutyType?.id),
                        threshold: settings?.heavyDutyOption?.threshold,
                        height: settings?.heavyDutyOption?.height,
                    },
                };
            }
            if (settings?.channelOrClamps) {
                // channelOrClamps
                result = { ...result, channelOrClamps: settings?.channelOrClamps };
            }
            if (settings?.mountingChannel) {
                // mountingChannel
                const mountingChannel = await WineCellarHardwareService.findBy({
                    slug: settings?.mountingChannel,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    mountingChannel: new mongoose.Types.ObjectId(mountingChannel?.id),
                };
            }
            if (settings?.glassType && settings?.glassType?.type) {
                // glassType
                const glassType = await WineCellarGlassTypeService.findBy({
                    slug: settings?.glassType?.type,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    glassType: {
                        type: new mongoose.Types.ObjectId(glassType?.id),
                        thickness: settings?.glassType?.thickness,
                    },
                };
            }
            if (settings?.doorLock && settings?.doorLock?.type) {
                // door lock
                const doorLock = await WineCellarHardwareService.findBy({
                    slug: settings?.doorLock?.type,
                    company_id: new mongoose.Types.ObjectId(companyId),
                });
                result = {
                    ...result,
                    doorLock: {
                        type: new mongoose.Types.ObjectId(doorLock?.id),
                        count: settings?.doorLock?.count,
                    },
                };
            }
            if (settings?.glassAddon) {
                // glassAddon
                // const glassAddon = await GlassAddonService.findBy({
                //     slug: settings?.glassAddon,
                //     company_id: new mongoose.Types.ObjectId(companyId),
                // });
                // result = {
                //     ...result,
                //     glassAddon: new mongoose.Types.ObjectId(glassAddon?.id),
                // };
            }
            // measurement Sides
            if (settings?.measurementSides) {
                result = {
                    ...result,
                    measurementSides: settings?.measurementSides,
                };
            }
            // noOfHoursToCompleteSingleDoor
            if (settings?.noOfHoursToCompleteSingleDoor) {
                result = {
                    ...result,
                    noOfHoursToCompleteSingleDoor: settings?.noOfHoursToCompleteSingleDoor,
                };
            }
            // layout variant
            if (settings?.variant) {
                result = {
                    ...result,
                    variant: settings?.variant,
                };
            }
            if (settings?.other) {
                // other
                result = {
                    ...result,
                    other: {
                        people: settings?.other?.people,
                        hours: settings?.other?.hours,
                    },
                };
            }
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};