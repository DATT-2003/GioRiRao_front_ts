import { Search } from "lucide-react"
import { useState } from "react"
import { setSearchKey } from "../../../features/drinks/drinkSlice"
import { useAppDispatch } from "../../../app/hooks"

const SearchBar = () => {
  const dispatch = useAppDispatch()

  const [searchValue, setSearchValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    setSearchValue(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      dispatch(setSearchKey(searchValue))
    }
  }

  const handleButtonClicked = () => {
    dispatch(setSearchKey(searchValue))
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={searchValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search for food, coffee, etc.."
        className="w-full bg-gray-800/50 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
      />
      <button>
        <Search
          size={20}
          onClick={handleButtonClicked}
          className="absolute left-3 top-[12px] text-gray-400 hover:text-gray-700 cursor-pointer"
        />
      </button>
    </div>
  )
}

export default SearchBar
