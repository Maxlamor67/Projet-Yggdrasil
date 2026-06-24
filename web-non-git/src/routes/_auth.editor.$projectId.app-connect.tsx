import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {useMutation} from "@tanstack/react-query";
import {api} from "@/lib/api.ts";
import { processAxiosError, logError } from "@/utils/error";
import { useError } from "@/contexts/ErrorContext";

export const Route = createFileRoute("/_auth/editor/$projectId/app-connect")({
  component: AppConnectPage,
});

function AppConnectPage() {
  const { projectId } = Route.useParams();
  const [qrData, setQrData] = useState<string | null>(null);
  const { showError } = useError();

  const setupTransferMutation = useMutation({
    mutationFn: async (type: 'APP_TO_SOFTWARE' | 'SOFTWARE_TO_APP' | 'SOFTWARE_TO_APP_PLANNING') => {
      const transfer = await api.transfer.transferControllerCreateV2(projectId, {
        type,
      });

      if (transfer.data) {
        let qrInfo;
        if (type === 'SOFTWARE_TO_APP' || type === 'SOFTWARE_TO_APP_PLANNING') {
          qrInfo = {
            projectId: transfer.data.projectId,
            transferId: transfer.data.transferId,
            ip: transfer.data.ip,
            portHttp: transfer.data.port,
          };
        } else {
          qrInfo = {
            transferId: transfer.data.transferId,
            ip: transfer.data.ip,
            portHttp: transfer.data.port,
          };
        }

        setQrData(JSON.stringify(qrInfo));
      }
    },
    onError: (error) => {
      logError(error, "SetupTransfer");
      showError(processAxiosError(error, "Impossible de générer le code de transfert"));
    },
  });

  const mapUrl = `/editor/${projectId}/map`;
  const syncUrl = `/editor/${projectId}/app-connect`;

  return (
    <div className="px-4 py-10">
      {/* Navigation  */}
      <Button variant={"outline"}>
        <Link to={mapUrl}>Retour à l'éditeur</Link>
      </Button>

      <div className="flex flex-col items-center w-full mt-10 gap-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">
          Connexion à l’application
        </h1>

        {/* QR Code */}
        {qrData !== null && (
          <div className="bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center">
            <QRCode
              size={256}
              value={qrData}
              viewBox={`0 0 256 256`}
              className="rounded-lg mb-4"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <Button
            onClick={() => setupTransferMutation.mutateAsync("SOFTWARE_TO_APP")}
            type="button"
            className="
                  bg-blue-600 text-white font-medium px-6 py-3
                  rounded-xl shadow hover:bg-blue-700 transition hover:cursor-pointer
                "
          >
            Envoyer
          </Button>
          <Button
            onClick={() => setupTransferMutation.mutateAsync("APP_TO_SOFTWARE")}
            type="button"
            className="
                  bg-green-600 text-white font-medium px-6 py-3
                  rounded-xl shadow hover:bg-green-700 transition hover:cursor-pointer
                "
          >
            Recevoir
          </Button>
          <Button
              onClick={() => setupTransferMutation.mutateAsync("SOFTWARE_TO_APP_PLANNING")}
              type="button"
              className="
                  bg-red-600 text-white font-medium px-6 py-3
                  rounded-xl shadow hover:bg-red-700 transition hover:cursor-pointer
                "
          >
            Envoyer le planning
          </Button>
        </div>
      </div>
    </div>
  );
}
