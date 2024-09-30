import React from "react";
import SectionTitle from "../../../Components/SectionTitle/SectionTitle";
import { useLoaderData } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAxiosOpen from "../../../hooks/useAxiosOpen";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const img_hosting_key= import.meta.env.VITE_image_hosting_key;

const img_hosting_api =  `https://api.imgbb.com/1/upload?key=${img_hosting_key}`

const UpdateItem = () => {
    const {name, category, recipe, price, _id} = useLoaderData();
    const { register, handleSubmit, reset } = useForm();
    const axiosOpen = useAxiosOpen();
  const axiosSecure = useAxiosSecure();
  const onSubmit = async(data) => {
    console.log(data);
    // image
    const imgFile = {image: data.image[0]}
    const res = await axiosOpen.post(img_hosting_api, imgFile, {
        headers: {
           'content-type' : 'multipart/form-data'
        }
    });
    if(res.data.success){
        const menuItem= {
            name : data.name,
            category: data.category,
            price: parseFloat(data.price),
            recipe: data.recipe,
            image: res.data.data.display_url
        }
        // send data via admin
        const menuRes = await axiosSecure.patch(`/menu/${_id}`, menuItem);
        console.log(menuRes.data)
        if(menuRes.data.modifiedCount > 0){
           
            Swal.fire({
                position: "center",
                icon: "success",
                title: `${data.name} has been saved successfully!`,
                showConfirmButton: false,
                timer: 1500
              });
        }
    }
    console.log(res.data)
  };
  return (
    <div>
      <SectionTitle heading="Update" subHeading="Your Items"></SectionTitle>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <div className="label">
              <span className="label-text">Recipe`s Name*</span>
            </div>
          </div>
          <input
          defaultValue={name}
            type="text"
            placeholder="Recipe Name"
            className="input input-bordered w-full "
            {...register("name", { required: true })}
          />
          <div className="flex gap-8 w-full">
            {/* Category */}
            <div className="w-1/2">
              <div className="form-control ">
                <div className="label">
                  <span className="label-text">Category Type*</span>
                </div>
              </div>
              <select
              
                defaultValue={category}
                {...register("category", { required: true })}
                className="select select-bordered w-full"
              >
                <option disabled value="default">
                  Select a Category
                </option>
                <option value="Salad">Salad</option>
                <option value="Pizza">Pizza</option>
                <option value="Soup">Soup</option>
                <option value="Dessert">Dessert</option>
                <option value="Drinks">Drinks</option>
              </select>
            </div>
            {/* price */}
            <div className="w-1/2">
              <div className="form-control">
                <div className="label">
                  <span className="label-text">Price*</span>
                </div>
              </div>
              <input
              defaultValue={price}
                type="number"
                placeholder="price"
                className="input input-bordered w-full "
                {...register("price", { required: true })}
              />
            </div>
          </div>
          <div className="form-control">
            <div className="label">
              <span className="label-text">Recipe Details*</span>
            </div>
            <textarea
            
            defaultValue={recipe}
              className="textarea textarea-bordered h-24"
              {...register("recipe", { required: true })}
              placeholder="recipe details"
            ></textarea>
          </div>
          <div className="w-full form-control">
            <input
              type="file"
              {...register("image", { required: true })}
              className="file-input file-input-ghost w-full max-w-xs"
            />
          </div>
          <button className="btn uppercase">
            updated menu item 
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateItem;
