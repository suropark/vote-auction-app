import React, { useState } from "react";
// import QRCode from "react-qr-code";
// import Countdown from "react-countdown";
function QrModal({ qrOpen, setQrOpen, qrData }) {
  const [remainTime, setRemainTime] = useState(300);

  return (
    <div>
      {/* <QRCode value={url} size={184} /> */}
      {/* <Countdown
        date={Date.now() + 1000 * 60 * 5}
        renderer={({ minutes, seconds }) => {
          return (
            <>
              {minutes} min {seconds} sec
            </>
          );
        }}
      /> */}
    </div>
  );
}

export default QrModal;

// QrModal.prototype = {
//     qrOpen:PropTypes.bool,
//     qrData:PropTypes
// }
