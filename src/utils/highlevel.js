const privateIntegrationKey = "pit-e3e78855-c6a4-4218-9688-df804af80e8c";
const baseUrl = process.env.HIGH_LEVEL_API_URL;
const locationId = "wMf03l211vQKvcwKgDYJ";
const axios = require("axios"); // Ensure axios is imported if not already

// The highLevelFlow function which executes the API call
exports.highLevelFlow = async (customerDetail, cost, contactNote) => {
  try {
    const contact = await createContact(customerDetail);
    const pipelineData = await getPipelineData();
    if (pipelineData?.data?.pipelines?.length) {
      const pipeline = pipelineData.data.pipelines[0];
      const pipelineStage = pipeline.stages.find(
        (stage) => stage.position === 3
      );
      // return { pipelineid: pipeline.id, stageId: pipelineStage.id };

      const opportunity = await createOpportunity(
        pipeline.id,
        pipelineStage.id,
        `${contact.data.contact.phone} - ${contact.data.contact.firstName}`,
        contact.data.contact.id,
        cost
      );
      console.log("Opportunity created:", opportunity.data);
      await createContactNote(contact.data.contact.id, contactNote);
      return opportunity.data?.opportunity; // Return the opportunity data
    } else {
      console.warn("No pipeline data or contact data found.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred during highLevelFlow:", error);
    return null; // Return null if there was an error
  }
};

// Create contact function for API request
const createContact = async (customerDetail) => {
  const url = `${baseUrl}/contacts/`;
  const headers = {
    Authorization: `Bearer ${privateIntegrationKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };
  const name = customerDetail?.name?.split(" ");
  const data = {
    firstName: name[0] ?? "",
    lastName: name[1] ?? "",
    name: customerDetail?.name,
    email: customerDetail?.email,
    locationId: locationId,
    gender: "male",
    phone: customerDetail?.phone,
    address1: customerDetail?.address,
    city: "Dolomite",
    state: "AL",
    postalCode: "35061",
    timezone: "America/Chihuahua",
    source: "public api",
    tags: ["contact created from api"],
    country: "US",
  };

  return await axios.post(url, data, { headers });
};

const getPipelineData = async () => {
  const url = `${baseUrl}/opportunities/pipelines?locationId=${locationId}`;
  const headers = {
    Authorization: `Bearer ${privateIntegrationKey}`,
    Version: "2021-07-28",
    // "Content-Type": "application/json",
  };
  return await axios.get(url, { headers });
  //   if (response.data.pipelines?.length) {
  //     const pipeline = response.data.pipelines[0];
  //     const pipelineStage = pipeline.stages.find((stage) => stage.position === 3);
  //     return { pipelineid: pipeline.id, stageId: pipelineStage.id };
  //   } else {
  //     return null;
  //   }
};

const createOpportunity = async (
  pipelineId,
  stageId,
  customerName,
  contactId,
  cost
) => {
  const url = `${baseUrl}/opportunities/`;
  const headers = {
    Authorization: `Bearer ${privateIntegrationKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };
  const data = {
    pipelineId: pipelineId,
    locationId: locationId,
    name: customerName,
    pipelineStageId: stageId,
    status: "open",
    contactId: contactId,
    monetaryValue: cost,
    source: "Website",
    // "customFields": [
    //   {
    //     "id": "AUKHX7JzEfQu4kiAQsxL",
    //     "fieldValue": "Standard Pivot Hinge 1"
    //   }
    // ]
  };
  return await axios.post(url, data, { headers });
};

const createContactNote = async (contactId, contactNote) => {
  const url = `${baseUrl}/contacts/${contactId}/notes`;
  const headers = {
    Authorization: `Bearer ${privateIntegrationKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };
  const data = {
    body: contactNote,
  };
  return await axios.post(url, data, { headers });
};

exports.updateHighLevelOpportunity = async (opportunityId, status) => {
  const url = `${baseUrl}/opportunities/${opportunityId}/status`;
  const headers = {
    Authorization: `Bearer ${privateIntegrationKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
  };
  const data = {
    status: status,
  };
  return await axios.put(url, data, { headers });
};