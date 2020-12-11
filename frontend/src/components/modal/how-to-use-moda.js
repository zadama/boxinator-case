import Modal from "./index";

const { useState } = require("react");

const TestPage = () => {
  const [modal, showModal] = useState(false);

  const onClose = () => {
    showModal(false);
  };

  const handleClick = () => {
    console.log("clicked");
  };

  return (
    <div>
      <button
        onClick={() => {
          showModal(true);
        }}
      >
        Show modal
      </button>

      <Modal isVisible={modal} onClose={onClose}>
        {/**Kod som du vill ha inut modal exv: */}

        <h3>Hej jag är inuti modal</h3>

        <button onClick={handleClick}>button inside modal</button>
      </Modal>
    </div>
  );
};
