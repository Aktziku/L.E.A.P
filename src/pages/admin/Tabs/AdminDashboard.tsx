import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonPage,
    IonRow,
    IonCol,
    useIonRouter,
} from '@ionic/react';
import { peopleOutline, readerOutline, schoolOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AdminDashboard: React.FC = () => {
    const chartRef = React.useRef<any>(null);

    // Add resize observer
    useEffect(() => {
        const handleResize = () => {
            if (chartRef.current) {
                chartRef.current.resize();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Dummy data - replace with actual data from your backend
    const stats = {
        totalUsers: 150,
        totalModules: 25,
        totalQuizzes: 40,
        averageScores: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [75, 82, 78, 85, 80, 88]
        }
    };

    const chartData = {
        labels: stats.averageScores.labels,
        datasets: [
            {
                label: 'Average Quiz Scores',
                data: stats.averageScores.data,
                fill: false,
                borderColor: '#b25ac2ff',
                backgroundColor: '#f8adc6',
                pointBackgroundColor: '#f8adc6',
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Average Quiz Scores Over Time',
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 50,
                max: 100,
            },
        },
        resizeDelay: 200, // Add small delay for smooth resizing
    };

    const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) => (
        
        <IonCard style={{ margin: '10px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <IonCardContent style={{ padding: '20px', background: '#ffffffff' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h3 style={{ margin: '0', color: '#5a2d6d', fontSize: '1rem' }}>{title}</h3>
                        <h2 style={{ margin: '10px 0', color: '#5a2d6d', fontSize: '1.8rem', fontWeight: 'bold' }}>{value}</h2>
                    </div>
                    <IonIcon
                        icon={icon}
                        style={{
                            fontSize: '2.5rem',
                            padding: '15px',
                            borderRadius: '12px',
                            backgroundColor: color,
                            color: 'white',
                        }}
                    />
                </div>
            </IonCardContent>
        </IonCard>
    );

    return (
        <IonPage>
            <IonContent style={{ '--background': '#ffffff' }}>

                <div 
                    style={{ 
                        padding: '20px',
                        }}
                >
                    {/* Stats Cards */}
                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" sizeMd="4">
                                <StatCard
                                    title="Total Users"
                                    value={stats.totalUsers}
                                    icon={peopleOutline}
                                    color="#002d54"
                                />
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                                <StatCard
                                    title="Total Modules"
                                    value={stats.totalModules}
                                    icon={readerOutline}
                                    color="#002d54"
                                />
                            </IonCol>
                            <IonCol size="12" sizeMd="4">
                                <StatCard
                                    title="Total Quizzes"
                                    value={stats.totalQuizzes}
                                    icon={schoolOutline}
                                    color="#002d54"
                                />
                            </IonCol>
                        </IonRow>
                    </IonGrid>

                    {/* Chart */}
                    <IonCard 
                        style={{ 
                            margin: '20px 0', 
                            padding: '20px', 
                            borderRadius: '15px',
                            background: '#002d54',
                            }}
                        >

                        <IonCardHeader>
                            <IonCardTitle style={{ color: '#002d54' }}>Quiz Performance Overview</IonCardTitle>
                        </IonCardHeader>
                        
                        <IonCardContent style={{ 
                            height: '50vh', // Make height relative to viewport
                            position: 'relative', // Required for chart resizing
                            width: '100%' // Ensure full width
                        }}>
                            <Line 
                                ref={chartRef}
                                data={chartData} 
                                options={chartOptions}
                                style={{ width: '100%', height: '100%' }}
                            />
                        </IonCardContent>
                    </IonCard>
                </div>
            </IonContent>
                                
                            
        </IonPage>
    );
};

export default AdminDashboard;