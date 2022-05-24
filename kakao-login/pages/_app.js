import Script from "next/script";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script src="https://developers.kakao.com/sdk/js/kakao.js" />
      <Component {...pageProps} />;
    </>
  );
}

export default MyApp;
