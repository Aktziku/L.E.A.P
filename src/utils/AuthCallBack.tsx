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

    if (!user) {
      router.push("/login", "root", "replace");
      return;
    }

    // Check if user already exists
    const { data: existingAccount, error: fetchError } = await supabase
      .from("accounts")
      .select("role")
      .eq("email", user.email)
      .maybeSingle();

    if (fetchError) {
      console.error("Fetch error:", fetchError.message);
      router.push("/login", "root", "replace");
      return;
    }

    // Insert only if new
    if (!existingAccount) {
      const { error: insertError } = await supabase.from("accounts").insert([
        {
          username:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "New User",
          email: user.email,
          role: "user",
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
      .from("accounts")
      .select("role")
      .eq("email", user.email)
      .maybeSingle();

    if (accountWithRole?.role === "admin") {
      router.push("/admin", "root", "replace");
    } else {
      router.push("/home", "root", "replace");
    }
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
