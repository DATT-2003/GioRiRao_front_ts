import React, { useEffect, useState } from "react"
import drinkApi from "../drinkApi"
import { IDrink } from "../drinkTypes"

type SizeKey = "M" | "S" | "L"

interface ICustomization {
  size: "S" | "M" | "L"
  price: number
}

interface IIngredient {
  name: string
  quantity: string
  unit: string
}

interface EditDrinkModalProps {
  drink: IDrink
  onClose: () => void
  onUpdate: () => void
}

const EditDrinkModal = ({ drink, onClose, onUpdate }: EditDrinkModalProps) => {
  // Khởi tạo state với dữ liệu có sẵn của drink
  const [name, setName] = useState(drink.name)
  const [description, setDescription] = useState(drink.description)
  const [shortDescription, setShortDescription] = useState(
    drink.shortDescription,
  )
  const [category, setCategory] = useState(drink.category)
  const [tags, setTags] = useState<string[]>(drink.tags || [])
  const [tagInput, setTagInput] = useState("")

  // Customizations: chuyển sang object để dễ chỉnh sửa
  const initialCustomizations: {
    [key in SizeKey]: { selected: boolean; price: number | "" }
  } = {
    M: { selected: false, price: "" },
    S: { selected: false, price: "" },
    L: { selected: false, price: "" },
  }

  if (drink.customization && drink.customization.length > 0) {
    drink.customization.forEach(cust => {
      initialCustomizations[cust.size] = { selected: true, price: cust.price }
    })
  }

  const [customizations, setCustomizations] = useState(initialCustomizations)

  // Ingredients
  const [ingredients, setIngredients] = useState<IIngredient[]>(
    drink.ingredients || [],
  )
  const [ingredientInput, setIngredientInput] = useState<IIngredient>({
    name: "",
    quantity: "",
    unit: "",
  })

  const [recipe, setRecipe] = useState(drink.recipe || "")

  // Thumbnail: lưu url ban đầu và file mới nếu người dùng chọn
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>(
    drink.thumbnail,
  )

  // Images: tích lũy các ảnh update (ban đầu dùng ảnh cũ nếu có)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    drink.images
      ? drink.images.sort((a, b) => a.order - b.order).map(img => img.url)
      : [],
  )

  const [loading, setLoading] = useState(false)

  // Xử lý file thumbnail
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  // Xử lý file images (tích lũy ảnh mới vào danh sách)
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setImageFiles(prev => [...prev, ...newFiles])
      const newPreviews = newFiles.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index))
  }

  const handleAddIngredient = () => {
    if (
      ingredientInput.name.trim() &&
      ingredientInput.quantity.trim() &&
      ingredientInput.unit.trim()
    ) {
      setIngredients(prev => [...prev, ingredientInput])
      setIngredientInput({ name: "", quantity: "", unit: "" })
    }
  }

  const handleCustomizationCheckboxChange = (
    size: SizeKey,
    checked: boolean,
  ) => {
    setCustomizations(prev => ({
      ...prev,
      [size]: { ...prev[size], selected: checked },
    }))
  }

  const handleCustomizationPriceChange = (
    size: SizeKey,
    price: number | "",
  ) => {
    setCustomizations(prev => ({
      ...prev,
      [size]: { ...prev[size], price },
    }))
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${drink.name}?`)) return
    try {
      setLoading(true)
      await drinkApi.deleteDrink(drink._id)
      alert("Drink deleted successfully!")
      onUpdate()
      onClose()
    } catch (error: any) {
      console.error(
        "Error deleting drink:",
        error.response?.data || error.message,
      )
      alert(
        `Failed to delete drink: ${error.response?.data?.message || error.message}`,
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const selectedCustomizations: ICustomization[] = Object.entries(
      customizations,
    )
      .filter(([_, value]) => value.selected)
      .map(([key, value]) => ({
        size: key as SizeKey,
        price: Number(value.price),
      }))

    if (
      !name ||
      !description ||
      !shortDescription ||
      !category ||
      !recipe ||
      selectedCustomizations.length === 0 ||
      (!thumbnailFile && !thumbnailPreview) ||
      (imagePreviews.length === 0 && imageFiles.length === 0) ||
      ingredients.length === 0
    ) {
      alert("Vui lòng nhập đầy đủ thông tin và upload ảnh!")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("description", description)
      formData.append("shortDescription", shortDescription)
      formData.append("category", category)
      tags.forEach(tag => formData.append("tags", tag))
      formData.append("customization", JSON.stringify(selectedCustomizations))
      formData.append("ingredients", JSON.stringify(ingredients))
      formData.append("recipe", recipe)

      // Nếu có file mới, upload thay đổi; nếu không, backend giữ nguyên
      if (thumbnailFile) {
        formData.append("thumbnail", thumbnailFile)
      }
      // Thêm cả file ảnh mới
      imageFiles.forEach(file => formData.append("images", file))

      // Debug FormData
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
      }

      const response = await drinkApi.updateDrink(drink._id, formData)
      console.log("Response from API:", response)

      if (response && response.updatedDrink) {
        alert("Drink updated successfully!")
        onUpdate()
        onClose()
      } else {
        alert(
          "Cập nhật drink thành công nhưng không nhận được dữ liệu từ server!",
        )
      }
    } catch (error: any) {
      console.error(
        "Error updating drink:",
        error.response?.data || error.message,
      )
      alert(
        `Failed to update drink: ${error.response?.data?.message || error.message}`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-gray-800 p-6 rounded-lg w-2/5 max-h-screen overflow-y-auto h-[90%]"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h2 className="text-2xl text-white mb-4">Edit Drink</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Drink Name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="p-2 rounded-md outline-none bg-gray-700 text-white"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="p-2 rounded-md outline-none bg-gray-700 text-white"
          />
          <textarea
            placeholder="Short Description"
            value={shortDescription}
            onChange={e => setShortDescription(e.target.value)}
            className="p-2 rounded-md outline-none bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="p-2 rounded-md outline-none bg-gray-700 text-white"
          />

          {/* Tags */}
          <div>
            <label className="text-white">Tags:</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                placeholder="Add tag"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                className="p-2 rounded-md outline-none bg-gray-700 text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Add Tag
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag, index) => (
                <div
                  key={index}
                  className="bg-gray-600 text-white py-1 px-2 rounded-md flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-1 text-red-500"
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Customizations */}
          <div>
            <label className="text-white">Sizes & Prices:</label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {(["M", "S", "L"] as SizeKey[]).map(s => (
                <div key={s} className="flex flex-col items-center">
                  <label className="text-white flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={customizations[s].selected}
                      onChange={e =>
                        handleCustomizationCheckboxChange(s, e.target.checked)
                      }
                    />
                    {s}
                  </label>
                  <input
                    type="number"
                    placeholder="Price"
                    value={customizations[s].price}
                    onChange={e =>
                      handleCustomizationPriceChange(s, Number(e.target.value))
                    }
                    className="p-2 rounded-md outline-none bg-gray-700 text-white w-24 mt-1"
                    disabled={!customizations[s].selected}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-white">Ingredients:</label>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Ingredient Name"
                  value={ingredientInput.name}
                  onChange={e =>
                    setIngredientInput(prev => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="p-2 rounded-md outline-none bg-gray-700 text-white max-w-xs"
                />
                <input
                  type="text"
                  placeholder="Quantity"
                  value={ingredientInput.quantity}
                  onChange={e =>
                    setIngredientInput(prev => ({
                      ...prev,
                      quantity: e.target.value,
                    }))
                  }
                  className="p-2 rounded-md outline-none bg-gray-700 text-white w-24"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={ingredientInput.unit}
                  onChange={e =>
                    setIngredientInput(prev => ({
                      ...prev,
                      unit: e.target.value,
                    }))
                  }
                  className="p-2 rounded-md outline-none bg-gray-700 text-white w-24"
                />
                <button
                  type="button"
                  onClick={handleAddIngredient}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md"
                >
                  Add
                </button>
              </div>
              <ul className="mt-2 list-disc ml-4">
                {ingredients.map((ing, index) => (
                  <li key={index} className="text-white">
                    {ing.name} - {ing.quantity} {ing.unit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recipe */}
          <textarea
            placeholder="Recipe"
            value={recipe}
            onChange={e => setRecipe(e.target.value)}
            className="p-2 rounded-md outline-none bg-gray-700 text-white"
          />

          {/* Thumbnail */}
          <div>
            <label className="text-white">Thumbnail (Single Image):</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
            />
            {thumbnailPreview && (
              <div className="flex justify-center mt-2">
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <label className="text-white">Images (Multiple Images):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />
            <div className="flex gap-2 mt-2 flex-wrap">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt="Image Preview"
                  className="w-20 h-20 object-cover rounded-md border"
                />
              ))}
            </div>
          </div>

          {/* Nút Delete bên trái, Cancel & Update bên phải */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 text-white py-2 px-4 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
              >
                {loading ? "Updating..." : "Update Drink"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditDrinkModal
