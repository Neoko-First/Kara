import React, { useState } from "react";
import InputField from "../../components/form/InputField";

export default function ReinitPassword() {
  const [data, setData] = useState({
    email: "alexandre@roulemarcel.fr",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();

  //   function handleSubmit(e) {
  //     setIsLoading(true);

  //     e.preventDefault();
  //     axiosInstance({
  //       method: "put",
  //       url: "/new/" + data.id,
  //       data,
  //     })
  //       .then(function (res) {
  //         setData(res.data);
  //         setIsLoading(false);
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //         setError(error.response.data);
  //         setIsLoading(false);
  //       });
  //   }

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div className="card p-[20px] w-96 bg-base-200 shadow-xl flex flex-col gap-[15px] items-center justify-center">
      <h1>Réinitialisation du mot de passe</h1>
      <InputField
        label={"Email"}
        required={true}
        name={"email"}
        type={"email"}
        onChange={handleChange}
        value={data.email}
        error={errors?.email}
      />
      <button className="btn btn-primary w-full" type="submit">
        Valider
      </button>
    </div>
  );
}
