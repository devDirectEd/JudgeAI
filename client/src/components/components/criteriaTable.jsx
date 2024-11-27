/* eslint-disable react/prop-types */
import { Slider, Text } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import {
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch
} from '@chakra-ui/react'
import { Button } from "@/components/ui/button"

export const CriteriaTable = ({ criteria, onEdit, onDelete, isDeletingCriteria = false }) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Evaluation Criteria</h2>
      </div>

      {!criteria?.length ? (
        <div className="text-center py-8">
          <Text fontSize="lg" fontWeight="bold" className="text-gray-600">
            Oops! Seems no criteria has been added.
          </Text>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criteria
                </th>
                <th className="w-1/3 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Weight
                </th>
                <th className="w-[100px] px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentage
                </th>
                <th className="w-[120px] px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {criteria.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <Text className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </Text>
                      <div className="flex items-center space-x-2">
                        <Text className="text-sm text-gray-600">
                          Subquestions
                        </Text>
                        <Switch 
                          isDisabled 
                          defaultChecked={item.active} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-full max-w-[200px]">
                      <Slider value={item.weight || 0} isReadOnly>
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb />
                      </Slider>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.weight || 0}%
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900"
                      onClick={() => onEdit(item)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-red-600"
                      onClick={() => onDelete(index)}
                      isLoading={isDeletingCriteria}
                      loadingText=""
                    >
                      <DeleteIcon className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};