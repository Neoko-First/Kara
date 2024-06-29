import React, { useState } from "react";
import InputField from "../../components/form/InputField";
import CheckBox from "../../components/form/CheckBox";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosConfig";

export default function SignUp() {
  const [data, setData] = useState({
    pseudo: "Neoko",
    email: "alexandre@roulemarcel.fr",
    password: "123456",
    passwordConf: "123456",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState();

  function handleSubmit(e) {
    setIsLoading(true);

    e.preventDefault();
    axiosInstance({
      method: "post",
      url: "/api/auth/register",
      data,
    })
      .then(function (res) {
        console.log(res.data);
        setData({});
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
          className="w-[90%] phone:w-[90%] tablet:w-[80%] laptop:w-[70%] desktop:w-[60%] tv:w-[50%] card p-[20px] bg-base-200 shadow-xl flex flex-col gap-[15px] items-center justify-center"
        >
          <h1>Inscription</h1>
          <InputField
            label={"Pseudo"}
            required={true}
            name={"pseudo"}
            onChange={handleChange}
            value={data.pseudo}
            error={errors?.pseudo}
          />
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
          <InputField
            label={"Confirmer votre mot de passe"}
            required={true}
            name={"passwordConf"}
            type={"password"}
            onChange={handleChange}
            value={data.passwordConf}
            error={errors?.passwordConf}
          />
          <div className="w-full ">
            <label className="label cursor-pointer flex gap-[10px] justify-start">
              <input
                type="checkbox"
                required
                className="checkbox checkbox-primary checkbox-xs"
              />
              <span className="label-text">
                J'accepte{" "}
                <Link to={"fes"} className="underline">
                  les conditions d'utilisation
                </Link>
              </span>
            </label>
          </div>
          <button className="btn btn-primary w-full" type="submit">
            Inscription
          </button>
          <div className="divider"></div>
          <div>
            Déjà membre ?&nbsp;
            <Link to="/login" className="underline ">
              Connexion
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
