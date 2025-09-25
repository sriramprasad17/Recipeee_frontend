import React, { useState, useEffect, useContext } from "react";
import recipeContext from "../context/recipeContext";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { Navigate, useNavigate } from "react-router-dom";

const Modal = ({ isOpen, closeModal, modalData }) => {
  let navigate = useNavigate();
  const { addRecipe, editRecipe } = useContext(recipeContext);
  const [recipeData, setRecipeData] = useState({
    name: "",
    type: "",
    description: "",
    ingredients: "",
    steps: "",
    duration: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (modalData && modalData.recipeData) {
      setRecipeData(modalData.recipeData);
    } else {
      handleReset();
    }
  }, [modalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validateForm()) return;

      if (modalData && modalData.recipeData) {
        await editRecipe(modalData.recipeData.id, recipeData);
      } else {
        await addRecipe(recipeData);
      }
      toast.success("Recipe saved successfully!");
      handleReset();
      closeModal();
      navigate("/recipes");
    } catch (error) {
      toast.error("Failed to save recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRecipeData({
      name: "",
      type: "",
      description: "",
      ingredients: "",
      steps: "",
      duration: "",
      imageUrl: "",
    });
  };

  const validateForm = () => {
    if (
      !recipeData.name ||
      !recipeData.description ||
      !recipeData.ingredients ||
      !recipeData.steps ||
      !recipeData.duration ||
      !recipeData.imageUrl ||
      !recipeData.type ||
      (recipeData.type !== "veg" && recipeData.type !== "non-veg")
    ) {
      toast.info("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 w-[500px] max-h-[550px] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center font-satisfy">
            {modalData ? `${modalData.heading} Recipe` : "Add New Recipe"}
          </h2>
          <form onSubmit={handleSubmit} onReset={handleReset}>
            <div className="mb-4">
              <label className="block text-black font-bold mb-2" htmlFor="name">
                Recipe Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={recipeData.name}
                onChange={handleChange}
                className="w-full p-2"
                placeholder="Enter recipe name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-black font-bold mb-2">
                Image URL
              </label>
              <input
                type="text"
                id="imageUrl"
                name="imageUrl"
                value={recipeData.imageUrl}
                onChange={handleChange}
                className="w-full p-2"
                placeholder="Enter image URL"
              />
            </div>
            <div className="mb-4">
              <label className="block text-black font-bold mb-2">Type</label>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="veg"
                  name="type"
                  value="veg"
                  checked={recipeData.type === "veg"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <label htmlFor="veg" className="ml-2 mr-4">
                  Vegetarian
                </label>
                <input
                  type="radio"
                  id="non-veg"
                  name="type"
                  value="non-veg"
                  checked={recipeData.type === "non-veg"}
                  onChange={handleChange}
                  className="form-radio"
                />
                <label htmlFor="non-veg" className="ml-2">
                  Non-Vegetarian
                </label>
              </div>
            </div>
            <div className="mb-4">
              <label
                className="block text-black font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={recipeData.description}
                onChange={handleChange}
                className="form-textarea w-full h-20 resize-none p-2"
                placeholder="Enter recipe description"
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                className="block text-black font-bold mb-2"
                htmlFor="ingredients"
              >
                Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={recipeData.ingredients}
                onChange={handleChange}
                className="form-textarea w-full h-20 resize-none p-2"
                placeholder="Enter ingredients"
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                className="block text-black font-bold mb-2"
                htmlFor="steps"
              >
                Steps to Make
              </label>
              <textarea
                id="steps"
                name="steps"
                value={recipeData.steps}
                onChange={handleChange}
                className="form-textarea w-full h-20 resize-none p-2"
                placeholder="Enter steps to make"
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                className="block text-black font-bold mb-2"
                htmlFor="duration"
              >
                Time Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={recipeData.duration}
                onChange={handleChange}
                className="w-full p-2"
                placeholder="e.g. 30 minutes"
              />
            </div>
            <div className="flex justify-end mt-12 gap-4">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <button
                    type="submit"
                    className="bg-white text-cyellow px-4 py-2 rounded font-semibold border border-cyellow hover:bg-cyellow hover:text-white"
                  >
                    {modalData ? modalData.heading : "Add"}
                  </button>
                  <button
                    type="reset"
                    className="bg-white text-blue-500 px-4 py-2 rounded font-semibold border border-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    Reset
                  </button>
                </>
              )}
              <button
                type="button"
                className="hover:bg-black hover:text-white px-4 py-2 rounded mr-2 bg-white text-black font-semibold border-black border"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default Modal;
