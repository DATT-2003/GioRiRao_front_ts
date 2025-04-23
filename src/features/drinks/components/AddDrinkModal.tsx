import React, { useState } from "react"
import drinkApi from "../drinkApi"
import { IDrink } from "../drinkTypes"

type SizeKey = "S" | "M" | "L"

interface ICustomization {
  size: "S" | "M" | "L"
  price: number
}

interface IIngredient {
  name: string
  quantity: string
  unit: string
}

const AddDrinkModal = ({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: () => void
}) => {
  // Các state cho thông tin cơ bản
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  // Category được chọn qua dropdown
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // State cho customization: hiển thị 3 ô M, S, L với checkbox và input giá tiền
  const [customizations, setCustomizations] = useState<{
    [key in SizeKey]: { selected: boolean; price: number | "" }
  }>({
    M: { selected: false, price: "" },
    S: { selected: false, price: "" },
    L: { selected: false, price: "" },
  })

  // Ingredients dưới dạng mảng
  const [ingredients, setIngredients] = useState<IIngredient[]>([])
  const [ingredientInput, setIngredientInput] = useState<IIngredient>({
    name: "",
    quantity: "",
    unit: "",
  })

  const [recipe, setRecipe] = useState("")

  // Thumbnail: chỉ nhận 1 ảnh
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)

  // // Images: nhận nhiều ảnh, lưu tích lũy
  // const [imageFiles, setImageFiles] = useState<File[]>([])
  // const [imagePreviews, setImagePreviews] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  // Xử lý file thumbnail
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setThumbnailFile(file)
      setThumbnailPreview(URL.createObjectURL(file))
    }
  }

  // // Xử lý file images
  // const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     const newFiles = Array.from(e.target.files)
  //     setImageFiles(prev => [...prev, ...newFiles])
  //     const newPreviews = newFiles.map(file => URL.createObjectURL(file))
  //     setImagePreviews(prev => [...prev, ...newPreviews])
  //   }
  // }

  // Xử lý tag
  const handleAddTag = () => {
    if (tagInput.trim()) {
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index))
  }

  // Xử lý ingredient
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

  // Xử lý chọn customization và nhập giá tiền
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Lấy danh sách customization được chọn
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
      !thumbnailFile ||
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
      // Thay vì append từng tag, luôn chuyển tags thành JSON array
      formData.append("tags", JSON.stringify(tags))
      formData.append("customization", JSON.stringify(selectedCustomizations))
      formData.append("ingredients", JSON.stringify(ingredients))
      formData.append("recipe", recipe)
      formData.append("thumbnail", thumbnailFile)
      // imageFiles.forEach(file => formData.append("images", file))

      // In ra FormData để kiểm tra (chỉ dùng cho debug)
      for (let [key, value] of formData.entries()) {
        console.log(key, value)
      }

      // Giả sử response trả về kiểu { newDrink: IDrink }
      const response: { newDrink: IDrink } =
        await drinkApi.createDrink(formData)
      console.log("Response from API:", response)

      if (response && response.newDrink) {
        alert("Drink created successfully!")
        onCreate()
        onClose()
      } else {
        alert("Tạo drink thành công nhưng cần đợi upload ảnh!")
      }
    } catch (error: any) {
      console.error(
        "Error creating drink:",
        error.response?.data || error.message,
      )
      alert(
        `Failed to create drink: ${error.response?.data?.message || error.message}`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-gray-800 p-6 rounded-lg w-2/5 h-[90%] overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <h2 className="text-2xl text-white mb-4">Add New Drink</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Các input cơ bản */}
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

          {/* Select Category */}
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="p-2 rounded-md outline-none bg-gray-700 text-white"
          >
            <option value="">Select Category</option>
            <option value="coffee">Coffee</option>
            <option value="tea">Tea</option>
            <option value="smoothie">Smoothie</option>
            <option value="juice">Juice</option>
            <option value="others">Others</option>
          </select>

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

          {/* Customizations (Sizes & Prices) */}
          <div>
            <label className="text-white">Sizes & Prices:</label>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {(["S", "M", "L"] as SizeKey[]).map(s => (
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
          {/* <div>
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
          </div> */}

          {/* Submit & Cancel Buttons */}
          <div className="flex justify-end gap-2">
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
              {loading ? "Uploading..." : "Add Drink"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddDrinkModal
