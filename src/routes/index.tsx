import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => {
    const navigate = useNavigate();
    useEffect(() => {
      navigate({ to: "/visao-geral", replace: true });
    }, [navigate]);
    return null;
  }
});
