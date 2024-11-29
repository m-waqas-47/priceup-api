exports.userCreatedTemplate = (data) => {
  return `<div><h1 style="color:#8477ad;text-align:center">Price Up</h1>
  <p style="color:#100d24l;font-size:22px">Your account is successfully created on PriceUp. <b>${data}</b> is your account password.</p>
  <p style="font-size:22px">PriceUp dashboard link : <a href="http://app.priceup.glass/login">Click here</a></p>
  </div>`;
};

exports.passwordUpdatedTemplate = (data) => {
  return `<div><h1 style="color:#8477ad;text-align:center">Price Up</h1>
  <p style="color:#100d24l;font-size:22px">Your account password is successfully updated. <b>${data}</b> is your account password.</p>
  <p style="font-size:22px">PriceUp dashboard link : <a href="http://app.priceup.glass/login">Click here</a></p>
  </div>`;
};
exports.userNotActiveTemplate = (err) => {
  return `<div><h1 style="color:#8477ad;text-align:center">Price Up</h1>
  <p style="color:#100d24l;font-size:22px">${err}</p>
  <p style="font-size:22px">PriceUp dashboard link : <a href="http://app.priceup.glass/login">Click here</a></p>
  </div>`;
};

exports.invoicePreviewTemplate = (data) => {
  return `<div><h1 style="color:#8477ad;text-align:center">Price Up</h1>
  <p style="color:#100d24l;font-size:22px">Invoice preview link is generated. Click here to redirect:${data}</p>
  </div>`;
};