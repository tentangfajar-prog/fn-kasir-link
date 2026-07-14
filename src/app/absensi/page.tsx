import { ApiJsonForm } from "@/components/domain/api-json-form";

export default function AbsensiPage() {
  return (
    <div className="space-y-4">
      <ApiJsonForm title="Status Absensi" description="Ambil status absensi hari ini." endpoint="/api/absensi/status" method="GET" />
      <ApiJsonForm title="Check-in Absensi" description="Scan QR dinamis dan kirim GPS. Radius divalidasi service layer." endpoint="/api/absensi/check-in" initialJson={JSON.stringify({ qr_token: "", latitude: 0, longitude: 0 }, null, 2)} />
      <ApiJsonForm title="Check-out Absensi" description="Check-out memakai QR dan GPS yang sama aturannya." endpoint="/api/absensi/check-out" initialJson={JSON.stringify({ qr_token: "", latitude: 0, longitude: 0 }, null, 2)} />
    </div>
  );
}
