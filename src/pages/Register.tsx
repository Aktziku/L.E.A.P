import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonInputPasswordToggle, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';

const Register: React.FC = () => {
    const styles = {
        dropShadow: {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">

                <IonGrid fixed>
                    <IonRow class="ion-justify-content-center">
                        <IonCol size="12" size-md="8" size-lg="6" size-xl="4">
                            <IonCard className='ion-shadow'>
                                <IonCardContent>
                                    <IonTitle className="ion-text-center" color={'primary'}>Register Form</IonTitle>

                                    <IonInput className='ion-margin-top' fill="outline"  label="User Name" labelPlacement="floating" value=""
                                        placeholder=" Enter Your User Name">
                                    </IonInput>
                                    <IonInput className='ion-margin-top' fill="outline"  label="First Name" labelPlacement="floating" value=""
                                        placeholder=" Enter Your First Name">
                                    </IonInput>
                                    <IonInput className='ion-margin-top' fill="outline"  label="Last Name" labelPlacement="floating" value=""
                                        placeholder=" Enter Your Last Name">
                                    </IonInput>
                                    <IonInput className='ion-margin-top' fill="outline" type="number" label="Age" labelPlacement="floating" value=""
                                        placeholder=" Enter Your Age">
                                    </IonInput>
                                    <IonInput className='ion-margin-top' fill="outline"  label="Address" labelPlacement="floating" value=""
                                        placeholder=" Enter Your Address">
                                    </IonInput>
                                    <IonInput className='ion-margin-top' fill="outline" type="email" label="Email" labelPlacement="floating" value=""
                                        placeholder=" Enter Your Email">
                                    </IonInput>
                                    <IonInput className='ion-margin-top' fill="outline" type="password" label="Password" labelPlacement="floating" value=""
                                        placeholder="Enter Your Password">
                                            <IonInputPasswordToggle slot="end" color={'dark'}></IonInputPasswordToggle>
                                    </IonInput>
                                    <IonInput className='ion-margin-top' fill="outline" type="password" label="Confirm Password" labelPlacement="floating" value=""
                                        placeholder="Confirm Your Password">
                                            <IonInputPasswordToggle slot="end" color={'dark'}></IonInputPasswordToggle>
                                    </IonInput>
                                    <IonButton className='ion-margin-top' expand="block" shape='round' color='primary'>
                                        Register
                                    </IonButton>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Register;