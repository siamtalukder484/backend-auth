const SSLCommerzPayment = require("sslcommerz-lts");

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASS;
// const is_live = JSON.parse(process.env.IS_LIVE);
const is_live = false;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
const backendUrl =
  process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 8000}`;
const apiBaseUrl = process.env.BASE_URL || "/api/v1";

const makePayment = async (req, res) => {
  //   const { creatorId, name, code, credits, description } = req.body;
//   const data = {
//     total_amount: 100,
//     currency: "BDT",
//     tran_id: "REF123",
//     success_url: `${backendUrl}${apiBaseUrl}/payment/success`,
//     fail_url: `${backendUrl}${apiBaseUrl}/payment/fail`,
//     cancel_url: `${backendUrl}${apiBaseUrl}/payment/cancel`,
//     ipn_url: `${backendUrl}${apiBaseUrl}/payment/ipn`,
//     shipping_method: "Courier",
//     product_name: "Computer.",
//     product_category: "Electronic",
//     product_profile: "general",
//     cus_name: "Customer Name",
//     cus_email: "customer@example.com",
//     cus_add1: "Dhaka",
//     cus_add2: "Dhaka",
//     cus_city: "Dhaka",
//     cus_state: "Dhaka",
//     cus_postcode: "1000",
//     cus_country: "Bangladesh",
//     cus_phone: "01711111111",
//     cus_fax: "01711111111",
//     ship_name: "Customer Name",
//     ship_add1: "Dhaka",
//     ship_add2: "Dhaka",
//     ship_city: "Dhaka",
//     ship_state: "Dhaka",
//     ship_postcode: 1000,
//     ship_country: "Bangladesh",
//   };
const data = {
        total_amount: 100,
        currency: 'BDT',
        tran_id: 'REF123', // use unique tran_id for each api call
        success_url: `${backendUrl}${apiBaseUrl}/payment/success`,
        fail_url: 'http://localhost:3030/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz
    .init(data)
    .then((apiResponse) => {
      // Redirect the user to payment gateway
      // let GatewayPageURL = apiResponse.GatewayPageURL
      // res.redirect(GatewayPageURL)
      // console.log('Redirecting to: ', GatewayPageURL)
      // console.log(apiResponse)
      // if(apiResponse.status == "SUCCESS"){
      //     res.redirect('http://localhost:3000/payment/success')
      // }
      res.send(apiResponse.GatewayPageURL);
    })
    .catch((error) => {
      res
        .status(502)
        .json({
          success: false,
          message: "Unable to initialize payment.",
          error: error.message,
        });
    });
};

const redirectToFrontend = (path) => (req, res) => {
  res.redirect(303, `${frontendUrl}${path}`);
};

const paymentSuccess = redirectToFrontend("/payment/success");
const paymentFail = redirectToFrontend("/payment/fail");
const paymentCancel = redirectToFrontend("/payment/cancel");

module.exports = {
  makePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
};
