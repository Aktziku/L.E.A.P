import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonModal, IonPage, IonSearchbar, IonTitle, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { logoIonic, searchOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClients';

interface HealthMonitoring {
    health_id: number;
    profileid: number;
    firstName: string;
    lastName: string;
    medical_history: string;
  
};

const HealthMonitoring: React.FC = () => {
    const [health, setHealth] = useState<HealthMonitoring[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingHealth, setEditingHealth] = useState<HealthMonitoring | null>();
    const [isEditing, setIsEditing] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

     // Reset loading state 
    useIonViewWillEnter(() => {
        console.log("HealthMonitoring view entered");
        setLoading(true);
        fetchHealthData();
        setHasFetched(true);
    });

    const fetchHealthData = async () => {
        try {
            const {data, error} =await supabase 
            .from('maternalhealthRecord')
            .select('*')
        
        } catch (error) {
            console.error('Error fetching health data:', error);
            setError('Error fetching health data');
        }
        
    };
    
    return (
        <IonPage>
            <IonContent style={{ '--background': '#ffffffff' }}>
                
            </IonContent>
        </IonPage>
    );
};

export default HealthMonitoring;