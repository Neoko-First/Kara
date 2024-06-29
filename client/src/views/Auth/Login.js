import React, { useState } from "react";
import InputField from "../../components/form/InputField";
import axiosInstance from "../../utils/axiosConfig";
import { Link } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({
    email: "alexandre@roulemarcel.fr",
    password: "123456",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();

  function handleSubmit(e) {
    setIsLoading(true);

    e.preventDefault();
    axiosInstance({
      method: "post",
      url: "/api/auth/login",
      data,
    })
      .then(function (res) {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setErrors(error.response.data);
        setIsLoading(false);
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <>
      {!isLoading ? (
        <form
          onSubmit={handleSubmit}
          className="w-full card p-[20px] bg-base-200 shadow-xl flex flex-col gap-[15px] items-center justify-center"
        >
          <h1>Connexion</h1>
          <InputField
            label={"Email"}
            required={true}
            name={"email"}
            type={"email"}
            onChange={handleChange}
            value={data.email}
            error={errors?.email}
          />
          <InputField
            label={"Mot de passe"}
            required={true}
            name={"password"}
            type={"password"}
            onChange={handleChange}
            value={data.password}
            error={errors?.password}
          />
          <div className="w-full">
            <Link to="/forgot-password" className="underline ">
              Mot de passe oublié
            </Link>
          </div>
          <button className="btn btn-primary w-full" type="submit">
            Connexion
          </button>
          <div className="divider"></div>
          <div>
            Pas encore membre ?&nbsp;
            <Link to="/sign-up" className="underline ">
              Inscription
            </Link>
          </div>
        </form>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}
    </>
  );
}
