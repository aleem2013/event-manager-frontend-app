import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createEvent } from '../api/events';
import toast from 'react-hot-toast';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDaysWarning, setShowDaysWarning] = useState<boolean>(false);


  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: (event: any) => {
      toast.success('Event created successfully!');
      navigate(`/events/${event.id}`);
    },
  });

  // Get current date in YYYY-MM-DDThh:mm format for datetime-local input
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

   // Calculate end date based on start date and number of days
   const calculateEndDate = (startDateStr: string, days: number) => {
    if (!startDateStr || days <= 0) return '';
    const start = new Date(startDateStr);
    const end = new Date(start);
    end.setDate(start.getDate() + days - 1); // Subtract 1 because the start day counts as day 1
    return end.toISOString().slice(0, 16);
  };

   // Handle number of days change
   const handleNumberOfDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const days = parseInt(e.target.value);
    setNumberOfDays(days);
    setShowDaysWarning(true);
    
    // If start date is already selected, update end date
    if (startDate) {
      setEndDate(calculateEndDate(startDate, days));
    }
  };

  // Handle start date change
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (numberOfDays > 0) {
      setEndDate(calculateEndDate(newStartDate, numberOfDays));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    

    // const startDate = formData.get('startDate') as string;
    // const endDate = formData.get('endDate') as string;
    if (!numberOfDays) {
      toast.error('Please enter the number of days first');
      return;
    }

    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }

    // Additional validation to ensure end date is after start date
    if (new Date(endDate) < new Date(startDate)) {
      toast.error('End date must be after start date');
      return;
    }

    mutation.mutate({
      title: formData.get('title') as string,
      address: formData.get('address') as string,
      googleMapsUrl: formData.get('googleMapsUrl') as string,
      numberOfDays: parseInt(formData.get('numberOfDays') as string),
      startDate,//: formData.get('startDate') as string,
      endDate,//: formData.get('endDate') as string,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Google Maps URL
          </label>
          <input
            type="url"
            name="googleMapsUrl"
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number of Days
          </label>
          <input
            type="number"
            name="numberOfDays"
            required
            min="1"
            value={numberOfDays || ''}
            onChange={handleNumberOfDaysChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          {showDaysWarning && numberOfDays > 0 && (
            <p className="text-blue-600 text-sm mt-1">
              ℹ️ Based on your selection, the event will run for {numberOfDays} day{numberOfDays > 1 ? 's' : ''}. 
              Please adjust if needed before selecting dates.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            name="startDate"
            required
            min={getCurrentDateTime()}
            value={startDate}
            onChange={handleStartDateChange}
            disabled={!numberOfDays}
            className="w-full px-3 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          {!numberOfDays && (
            <p className="text-amber-600 text-sm mt-1">
              Please enter the "Number of Days" first
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Date & Time
          </label>
          <input
            type="datetime-local"
            name="endDate"
            required
            min={getCurrentDateTime()}
            value={endDate}
            readOnly
            className="w-full px-3 py-2 border rounded-md bg-gray-50"
          />
          {startDate && endDate && (
            <p className="text-gray-600 text-sm mt-1">
              End date is automatically calculated based on the start date and number of days
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={mutation.isPending || !numberOfDays || !startDate || !endDate}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;