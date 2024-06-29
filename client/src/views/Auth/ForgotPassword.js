import React, { useState } from "react";
import InputField from "../../components/form/InputField";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
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
    <form className="w-[90%] phone:w-[90%] tablet:w-[80%] laptop:w-[70%] desktop:w-[60%] tv:w-[50%] card p-[20px] bg-base-200 shadow-xl flex flex-col gap-[15px] items-center justify-center">
      <h1>Mot de passe oublié</h1>
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
      <div className="divider"></div>
      <div>
        <Link to="/login" className="underline ">
          Connexion
        </Link>
      </div>
    </form>
  );
}
