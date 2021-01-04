const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

templates = {
  confirm_account: "d-c79dcc0b52f94cefb311c087457b9d62",
  order: "d-6e6ea4de6b934af9a3d9346fda57f755",
};

const sendEmail = async (data) => {
  const msg = {
    to: data.receiver,
    from: "no-reply@shayantsital.com",
    templateId: templates[data.templateName],
    dynamic_template_data: {
      // Confirm account data
      name: data.name,
      confirm_account_url: data.confirm_account_url,

      // Order Mail Data
      order: data.order,
      itemsPrice: data.itemsPrice,
      tax: data.tax,
      shipping: data.shipping,
      total: data.total,
      orderItems: data.orderItems,
    },
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};

module.exports = { sendEmail };
