import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState } from 'react';

interface AddCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (caseData: any) => Promise<void>;
}
const AddCaseModal: React.FC<AddCaseModalProps> = ({ isOpen, onClose, onSave }) => {
       const [isEditing, setIsEditing] = useState(false);
       const [loading, setLoading] = useState(false);
       const [error, setError] = useState<string | null>(null);
    return (
        <IonPage>
            
        </IonPage>
    );
};

export default AddCaseModal;