import { useEffect, useState } from "react";
import { IOrder } from "../components/orderlistTypes";
import drinkApi from "../../drinks/drinkApi";
import { IDrink } from "../../drinks/drinkTypes";

interface Props {
  order: IOrder;
  onClose: () => void;
  onMarkDone?: (orderId: string) => void;
}

const OrderDetailModal = ({ order, onClose, onMarkDone }: Props) => {
  const [drinkDetails, setDrinkDetails] = useState<Record<string, IDrink>>({});
  const [showRecipe, setShowRecipe] = useState<Record<string, boolean>>({});
  const [checklist, setChecklist] = useState<Record<string, boolean[]>>({});

  useEffect(() => {
    const fetchDrinks = async () => {
      const result: Record<string, IDrink> = {};
      const checklistInit: Record<string, boolean[]> = {};
      const recipeShown: Record<string, boolean> = {};

      for (const item of order.items) {
        try {
          const drink = await drinkApi.getDrinkDetail(item.drinkId);
          result[item.drinkId] = drink;

          const steps = drink.recipe?.split(". ").filter((s) => s.trim() !== "") || [];
          checklistInit[item.drinkId] = steps.map(() => false);
          recipeShown[item.drinkId] = false;
        } catch (err) {
          console.error("Failed to fetch drink detail", err);
        }
      }

      setDrinkDetails(result);
      setChecklist(checklistInit);
      setShowRecipe(recipeShown);
    };

    fetchDrinks();
  }, [order]);

  const handleCheckStep = (drinkId: string, index: number) => {
    setChecklist((prev) => {
      const updated = [...prev[drinkId]];
      updated[index] = !updated[index];
      return { ...prev, [drinkId]: updated };
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white text-black p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg relative">
        <button onClick={onClose} className="absolute top-2 right-4 text-xl font-bold">×</button>

        <h2 className="text-xl font-bold mb-2">Order: {order.code}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Time: {new Date(order.createdAt).toLocaleString()}
        </p>

        {order.items.map((item, idx) => {
          const drink = drinkDetails[item.drinkId];
          const recipeSteps = drink?.recipe?.split(". ").filter((s) => s.trim() !== "") || [];
          const checklistSteps = checklist[item.drinkId] || [];

          return (
            <div key={idx} className="border-b py-4">
              <div className="flex gap-4">
                {drink?.thumbnail && (
                  <img src={drink.thumbnail} alt={item.drinkName} className="w-24 h-24 object-cover rounded" />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.drinkName}</h3>
                  <p>Size: {item.size} | Quantity: {item.quantity}</p>
                  {item.note && <p>Note: {item.note}</p>}
                  {item.toppings?.length > 0 && (
                    <p>
                      Toppings: {item.toppings.map((t) => `${t.name} (${t.quantity ?? "x1"})`).join(", ")}
                    </p>
                  )}

                  <button
                    className="mt-2 text-blue-600 text-sm underline"
                    onClick={() =>
                      setShowRecipe((prev) => ({
                        ...prev,
                        [item.drinkId]: !prev[item.drinkId],
                      }))
                    }
                  >
                    {showRecipe[item.drinkId] ? "Ẩn công thức" : "Hiện công thức"}
                  </button>

                  {showRecipe[item.drinkId] && (
                    <ul className="mt-2 space-y-1">
                      {recipeSteps.map((step, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checklistSteps[i] || false}
                            onChange={() => handleCheckStep(item.drinkId, i)}
                          />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <button
          className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={() => {
            onMarkDone?.(order._id);
            onClose();
          }}
        >
          Mark as Done
        </button>
      </div>
    </div>
  );
};

export default OrderDetailModal;
