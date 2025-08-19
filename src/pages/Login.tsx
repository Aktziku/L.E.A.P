import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonInputPasswordToggle, IonPage, IonRow, IonTitle, IonToolbar, useIonLoading, useIonRouter } from '@ionic/react';
import React from 'react';
import { logIn, logoFacebook, logoIonic, logoGoogle } from 'ionicons/icons';

const Login: React.FC = () => {
    const router = useIonRouter();
    const[present, dismiss] = useIonLoading();

    const doLogin = async (event:any) => {
        // Handle login logic here
        event.preventDefault();
        await present('Loging in...')
        setTimeout(async() => {
            dismiss();
            router.push('/home', 'root', 'replace');
        }, 2000);
    };

    return (
        <IonPage>
            <IonContent>
                <IonGrid fixed>


                <IonRow class="ion-justify-content-center">
                    <IonCol size="12" size-md="8" size-lg="6" size-xl="4">
                        <IonCard>
                            <IonCardContent>
                                <IonRow class="ion-justify-content-center">
                                    <IonCol size="12" size-md="8" size-lg="6" size-xl="4">
                                        <div className="ion-text-center ion-padding">
                                            <img src={logoIonic} alt="Ionic Logo" style={{ width: '100px', height: '100px' }} />
                                        </div>
                                    </IonCol>
                                </IonRow>

                                <form onSubmit={doLogin}>
                                <IonInput  fill="outline" type ="email" label="Email" labelPlacement="floating" value=""
                                    placeholder=" Enter Your Email">
                                </IonInput>

                                <IonInput className='ion-margin-top'
                                    fill="outline" type="password" label="Password" labelPlacement="floating" value=""
                                    placeholder="Enter Your Password">
                                    <IonInputPasswordToggle slot="end" color={'dark'}></IonInputPasswordToggle>
                                </IonInput>
                                <IonButton className='ion-margin-top' type='submit' expand="block" shape='round' color='primary'>
                                    Login
                                    <IonIcon icon={logIn} slot="end" />
                                </IonButton>
                                
                                <IonButton routerLink="/register" expand="full" fill="clear" shape='round'>
                                    Don't have an account? Register here
                                </IonButton>
                                </form>

                                <div className="ion-text-center">
                                or sign in with
                                </div>
                                <form className='ion-text-center'>
                                    <IonButton className='ion-margin-top'  fill="clear" shape='round'>
                                        <IonIcon icon={logoGoogle} slot="start" />   
                                        Google
                                    </IonButton>
                                    <IonButton className='ion-margin-top'  fill="clear" shape='round'>
                                        <IonIcon icon={logoFacebook} slot="start" />   
                                        Facebook
                                    </IonButton>
                                </form>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Login;