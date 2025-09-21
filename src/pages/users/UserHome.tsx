import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React from 'react';
import { supabase } from '../../utils/supabaseClients';

const UserHome: React.FC = () => {
    const navigation = useIonRouter();
      const handleLogout = async () => {
        try {
            const {error} = await supabase.auth.signOut();

            if (error) {
                console.error('Error signing out:', error.message);
                return;
            }
            localStorage.clear();
            navigation.push('/login', 'forward', 'replace');
        } catch (error) {
            console.error('unexpected error', error);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Home</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonButton onClick={handleLogout}>Logout</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default UserHome;