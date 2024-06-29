import React from "react";
import Logo from "../../components/Logo";

export default function index() {
  return (
    <div className="flex flex-col gap-[25px]">
      <div className="flex flex-col gap-[10px]">
        <button className="btn btn-primary w-fit">Se deconnecter</button>
        <p>
          Si vous vous déconnectez de votre compte, celui-ci sera conservé et ne
          sera plus consultable, sauf par vos amis.
        </p>
      </div>
      <div className="flex flex-col gap-[10px]">
        <button className="btn btn-error w-fit">Supprimer mon compte</button>
        <p>
          Suppression défionitivce de votre compte. Vous ne pourrez plus accéder
          à votre compte, mais vous pourrez le restaurer si vous le souhaitez.
        </p>
      </div>
      <div className="flex flex-col gap-[10px]">
        <p className="text-primary font-bold">Confidentialité</p>
        <ul>
          <li>Politique relative aux cookies</li>
          <li>Politique de confidentialité</li>
          <li>Préférence de confidentialité</li>
        </ul>
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex items-center justify-center gap-[10px]">
          <div className="h-[25px] w-[25px]">
            <Logo />
          </div>
          <p className="permanent-marker-regular text-2xl">KARA</p>
        </div>
        <p className="text-center">Versio 0.1</p>
      </div>
    </div>
  );
}
