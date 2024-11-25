import  { useState } from "react";
import PropTypes from 'prop-types';
import { Toast} from "@chakra-ui/react";
import warn from "../../assets/warning.svg";
import excel from "../../assets/excel.svg";
import { CloseIcon } from "@chakra-ui/icons";


const SpreadsheetLinkCard = ({
  onClose,
  templateUrl,
  descriptionText,
}) => {
  const [spreadsheetUrl, setSpreadsheetUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
     

      const syncDelay = (ms) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      for (let count = 1; count <= 2; count++) {
        Toast({
          description: `Successfully added spreasdsheet`,
          variant: "success",
        });
        await syncDelay(500);
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Error uploading spreadsheet:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setSpreadsheetUrl(event.target.value);
  };

  const handleDownload = () => {
    const exportUrl = templateUrl.replace(
      "/edit?gid=0#gid=0",
      "/export?format=xlsx"
    );
    window.open(exportUrl, "_blank");
  };

  return (
    <div className="bg-[#FAF9F6] rounded-lg shadow-md p-6 mx-auto w-[460px] h-[578px]">

        <h2 className="text-2xl font-semibold text-left mb-4">Import from Spreadsheet</h2>
        <CloseIcon onClick={onClose} className="absolute top-4 right-4" bg={"gray.100"} cursor={"pointer"}/>
      <p className="text-gray-600 mb-10 text-left text-sm">{descriptionText}</p>

      <div className="mb-4 mt-4">
        <label
          htmlFor="spreadsheetUrl"
          className="block text-sm font-medium text-gray-700 mb-2 text-left"
        >
          Spreadsheet URL
        </label>
        <input
          type="text"
          id="spreadsheetUrl"
          className="w-full p-2 border bg-[#FAF9F6] border-gray-300 rounded-md"
          placeholder="https://yourspreadsheetlink.com"
          value={spreadsheetUrl}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-start space-x-2 mb-10 ">
        <span className="text-amber-500">
          <img
            src={warn}
            alt="warning"
            width={30}
            height={30}
            className="my-1"
          />
        </span>
        <p className="text-sm text-[#00000066]">
          <span className="font-bold">NOTE:</span> Please make sure the
          spreadsheet is public and accessible to everyone.
        </p>
      </div>

      <div className="bg-blue-50 rounded-md py-4 px-6 mb-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src={excel}
            alt="excel"
            width={30}
            height={30}
            className="-mt-7 -ml-2 my-1"
          />
          <div className="text-sm text-left">
            <h3 className="font-semibold">Spreadsheet Template</h3>
            <p className="text-[#6B7CF6]">
              Download this spreadsheet template and fill in the product details
            </p>
          </div>
        </div>
        <button
          onClick={handleDownload}
          className="text-[#6B7CF6] font-semibold px-3 py-1 rounded-md border border-[#6B7CF6] text-sm"
        >
          Download
        </button>
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full bg-[#6B7CF6] text-white p-4 rounded-md transition duration-300 ${
          isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </div>
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
};
SpreadsheetLinkCard.propTypes = {
  onClose: PropTypes.func.isRequired,
  templateUrl: PropTypes.string.isRequired,
  descriptionText: PropTypes.string.isRequired,
};

export default SpreadsheetLinkCard;