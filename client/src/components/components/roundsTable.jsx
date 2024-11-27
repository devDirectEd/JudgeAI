/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button"
import { DeleteIcon, Spinner } from "@chakra-ui/icons"

const RoundsTable = ({ rounds, onSelect, selectedRound, onDelete, isDeletingRound = null, isLoading = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Round Name
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? 
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" color="blue.500" />
          </div>
          :
          rounds.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                No rounds have been added yet.
              </td>
            </tr>
          ) : (
            rounds.map((round) => (
              <tr 
                key={round._id} 
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedRound?._id === round._id ? 'bg-blue-50' : ''
                }`}
              >
                <td 
                  className="px-6 py-4"
                  onClick={() => onSelect(round)}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {round.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(round._id);
                  }}
                  isLoading={isDeletingRound === round._id}
                  loadingText=""
                >
                  <DeleteIcon className="h-4 w-4" />
                </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RoundsTable;