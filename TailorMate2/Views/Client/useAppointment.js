import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://192.168.1.190:5000/api/appointments?userId=${userId}`);
      const data = await response.json();

      if (response.ok) {
        setAppointments(data.appointments);
      } else {
        setError(data.message || 'Failed to fetch appointments.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addAppointment = async (newAppointment) => {
    try {
      const response = await fetch('http://192.168.1.190:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
      });

      if (response.ok) {
        // Refetch appointments after adding a new one
        await fetchAppointments();
        return true;
      } else {
        setError('Could not add appointment');
        return false;
      }
    } catch (error) {
      setError('An unexpected error occurred');
      return false;
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return { appointments, loading, error, addAppointment };
};

export default useAppointments;
