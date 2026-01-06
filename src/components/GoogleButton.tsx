import { useEffect, useRef } from "react";

interface GoogleCredentialResponse {
  credential?: string;
}

export default function GoogleButton({
  onToken,
}: {
  onToken: (idToken: string) => void;
}) {
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const google = window.google;
    if (!google?.accounts?.id || !divRef.current) return;

    google.accounts.id.initialize({
      client_id: clientId,
      callback: (resp: GoogleCredentialResponse) => {
        // resp.credential = ID token (JWT)
        if (resp?.credential) onToken(resp.credential);
      },
    });

    google.accounts.id.renderButton(divRef.current, {
      theme: "outline",
      size: "large",
      width: 280,
      text: "continue_with",
    });
  }, [onToken]);

  return <div ref={divRef} />;
}
