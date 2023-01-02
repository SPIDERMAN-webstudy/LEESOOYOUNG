import axios from "axios";

export default function Home() {
  // const data = "싸늘하다. 가슴에 비수가 날아와 꽂힌다.";
  // const url =
  //   "https://naveropenapi.apigw.ntruss.com/sentiment-analysis/v1/analyze";
  // const headers = {
  //   "X-NCP-APIGW-API-KEY-ID": "vkwltrbig5",
  //   "X-NCP-APIGW-API-KEY": "UqZ1zzKFVcok8kds0QxI2ogrUTSTvzpmCH883QZd",
  //   "Content-Type": "application/json",
  // };
  // axios({ method: "post", url: url, data: data, headers: headers }).then(
  //   (res) => console.log(res)
  // );
  var axios = require("axios");
  var data = JSON.stringify({
    text: "nice",
  });

  var config = {
    method: "post",
    url: "https://bert-flask-uvqwc.run.goorm.io/bert",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
  return <div>hello</div>;
}
