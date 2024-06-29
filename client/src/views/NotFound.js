import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-full flex-1 w-full flex flex-col items-center justify-center gap-[20px] text-center">
      <h1 className="text-8xl">Erreur 404</h1>
      <p className="text-2xl">Il semblerait que vous-vous soyez perdu...</p>
      <Link to="/admin" className="btn btn-primary">
        Retour en lieu sûre
      </Link>
    </div>
  );
}
