import React, { useState, useEffect } from "react"
import axios from "axios"
import { Upload } from "lucide-react"
import inventoryApi from "../../features/inventory/inventoryApi"
import { Ingredient } from "../../features/inventory/inventoryTypes"
import authApi from "../../features/authentication/authApi"
import { IUserSession } from "../../features/authentication/authTypes"

const InventoryPage = () => {
  const [inventory, setInventory] = useState<Ingredient[] | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [storeId, setStoreId] = useState("6780d1c957dfc98e89675b55")
  const [me, setMe] = useState<IUserSession | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const meDB = await authApi.getMeInfo()
    setMe(meDB)
    setStoreId(meDB.storeId)
    const result = await inventoryApi.getInventoryByStore(meDB.storeId)
    setInventory(result || [])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !storeId) return // đảm bảo storeId có

    try {
      await inventoryApi.importGoods(storeId, selectedFile)
      await fetchData()
      setSelectedFile(null)
    } catch (err) {
      console.error("Error uploading file:", err)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hàng tồn kho</h1>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
            id="upload-input"
          />
          <label
            htmlFor="upload-input"
            className="inline-flex items-center px-4 py-2 border rounded bg-rose-400 shadow hover:bg-rose-500 cursor-pointer"
          >
            <Upload className="mr-2 h-4 w-4" /> Nhập hàng
          </label>
          {selectedFile && (
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Tải lên
            </button>
          )}
        </div>
      </div>

      <div className="bg-gray-500 rounded shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-black">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên nguyên liệu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-400 divide-y divide-black">
            {inventory &&
              inventory.map((item: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {item.quantity}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default InventoryPage
