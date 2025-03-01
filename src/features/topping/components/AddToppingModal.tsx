import React, { useState } from "react"
import toppingApi from "../toppingApi"

const AddToppingModal = ({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: () => void
}) => {
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number | "">("")
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || price === "" || !image) {
      alert("Vui lòng nhập đủ thông tin và chọn ảnh!")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("price", price.toString())
      formData.append("thumbnail", image)

      await toppingApi.createTopping(formData)

      alert("Topping created successfully!")
      onCreate() // Load lại danh sách topping
      onClose() // Đóng modal
    } catch (error: any) {
      console.error(
        "Error creating topping:",
        error.response?.data || error.message,
      )
      alert(
        `Failed to create topping: ${error.response?.data?.message || error.message}`,
      )
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl text-white mb-4">Add New Topping</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Topping Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-2 rounded-md outline-none bg-gray-700 text-white"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={e => setPrice(Number(e.target.value))}
            className="p-2 rounded-md outline-none bg-gray-700 text-white"
          />

          <input type="file" accept="image/*" onChange={handleImageChange} />

          {preview && (
            <div className="flex justify-center">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-600 text-white py-2 px-4 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddToppingModal
