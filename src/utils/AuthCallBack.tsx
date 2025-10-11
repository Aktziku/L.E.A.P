import { IonPage, IonContent, IonSpinner } from "@ionic/react";
import { useEffect } from "react";
import { useIonRouter } from "@ionic/react";
import { supabase } from "../utils/supabaseClients";

const AuthCallback: React.FC = () => {
  const router = useIonRouter();

  useEffect(() => {
    const handleOAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      //console.log('Auth state:', user); // Debug log

      if (!user) {
        router.push("/login", "root", "replace");
        return;
      }    // Check if user already exists
      const { data: existingAccount, error: fetchError } = await supabase
        .from("users")
        .select("role, auth_id")
        .eq("email", user.email)
        .maybeSingle();

      if (fetchError) {
        console.error("Fetch error:", fetchError.message);
        router.push("/login", "root", "replace");
        return;
      }

      // If account exists but auth_id is not set, update it
      if (existingAccount && !existingAccount.auth_id) {
        const { error: updateError } = await supabase
          .from("users")
          .update({ auth_id: user.id })
          .eq("email", user.email);

        if (updateError) {
          console.error("Update error:", updateError.message);
          router.push("/login", "root", "replace");
          return;
        }
      }

      // Insert only if new
      if (!existingAccount) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            username:
              user.user_metadata?.full_name ||
              user.email?.split("@")[0] ||
              "New User",
            email: user.email,
            role: "user",
            auth_id: user.id,
          },
        ]);

        if (insertError) {
          console.error("Insert error:", insertError.message);
          router.push("/login", "root", "replace");
          return;
        }
      }

      // Fetch role again safely
      const { data: accountWithRole } = await supabase
        .from("users")
        .select("role")
        .eq("email", user.email)
        .maybeSingle();


      router.push("/admin", "root", "replace");

    };

    handleOAuth();
  }, [router]);

  return (
    <IonPage>
      <IonContent
        className="ion-text-center ion-padding"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          hight: '100vh',
        }}
      >

        <IonSpinner
          name="crescent"
        />
        <p>Signing in...</p>
      </IonContent>
    </IonPage>
  );
};

export default AuthCallback;
