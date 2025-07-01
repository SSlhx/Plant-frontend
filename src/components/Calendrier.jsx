import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckUser } from '../utils/session';
import './Calendrier.css';
import frLocale from '@fullcalendar/core/locales/fr';

export default function Calendar() {
    const Base_URL = import.meta.env.VITE_URL_API;

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        async function fetchSessionAndParcelles() {
            const sessionUser = await CheckUser();
            if (!sessionUser) {
                alert('Session invalide ou expirée');
                navigate('/connexion');
                return;
            }
            setUser(sessionUser);

            try {
                const res = await fetch(`${Base_URL}/api/parcelles`, {
                    credentials: 'include',
                });

                if (!res.ok) throw new Error('Erreur lors du chargement des données');

                const parcelles = await res.json();

                const calendarEvents = parcelles.flatMap(parcelle =>
                    parcelle.pousses.flatMap(pousse => {
                        const events = [];

                        const datePlantation = new Date(pousse.datePlantation);
                        const tempsAvantRecolte = pousse.variete.temps_avant_recolte;
                        const frequenceArrosage = pousse.variete.frequence_arrosage;

                        const dateRecolte = new Date(datePlantation);
                        dateRecolte.setDate(datePlantation.getDate() + parseInt(tempsAvantRecolte));

                        events.push({
                        title: `🌱 Planté : ${pousse.variete.libelle}`,
                        parcelle: parcelle.libelle,
                        date: datePlantation.toISOString().split('T')[0],
                        color: '#198754',
                        });

                        events.push({
                        title: `🧺 À récolter : ${pousse.variete.libelle}`,
                        date: dateRecolte.toISOString().split('T')[0],
                        color: '#9C2828',
                        extendedProps: {
                            parcelle: parcelle.libelle
                        }
                        });

                        if (frequenceArrosage > 0) {
                        const dateArrosage = new Date(datePlantation);
                        while (dateArrosage <= dateRecolte) {
                            events.push({
                            title: `💧 À arroser : ${pousse.variete.libelle}`,
                            parcelle: parcelle.libelle,
                            date: dateArrosage.toISOString().split('T')[0],
                            color: '#2196f3',
                            });
                            dateArrosage.setDate(dateArrosage.getDate() + parseInt(frequenceArrosage));
                        }
                        }

                        return events;
                    })
                );

                setEvents(calendarEvents);
            } catch (err) {
                console.error(err);
            }
        }

        fetchSessionAndParcelles();
    }, [navigate, Base_URL]);

    const handleEventClick = ({ event }) => {
        setSelectedEvent({
            title: event.title,
            date: event.startStr,
            ...event.extendedProps
        });
        setShowModal(true);
    };

    return (
        <div className="container my-4">
            <h2 className="mb-3">Calendrier d'Entretien</h2>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventClick={handleEventClick}
                height="auto"
                locale={frLocale}
                firstDay={1}
            />

            {showModal && (
                <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4>{selectedEvent?.parcelle}</h4>
                            <h5 className="modal-title">{selectedEvent?.title}</h5>
                        </div>
                        <div className="modal-body">
                            <p><strong>Date :</strong> {new Date(selectedEvent?.date).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="modal-close" onClick={() => setShowModal(false)}>
                                Fermer
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}