import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createEvent } from '../api/events';
import toast from 'react-hot-toast';
import LoadingSpinner from './LoadingSpinner';
import { useTranslation } from 'react-i18next';

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [numberOfDays, setNumberOfDays] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showDaysWarning, setShowDaysWarning] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: createEvent,
    onSuccess: (event: any) => {
      toast.success(t('events.create.success'));
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

    if (!numberOfDays) {
      toast.error(t('events.create.errors.noDays'));
      return;
    }

    if (!startDate) {
      toast.error(t('events.create.errors.noStartDate'));
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      toast.error(t('events.create.errors.invalidEndDate'));
      return;
    }

    mutation.mutate({
      title: formData.get('title') as string,
      address: formData.get('address') as string,
      googleMapsUrl: formData.get('googleMapsUrl') as string,
      numberOfDays: parseInt(formData.get('numberOfDays') as string),
      startDate,
      endDate,
    });
  };

  return (
    <>
      {mutation.isPending && <LoadingSpinner />}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">{t('events.create.title')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('events.create.eventTitle')}
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
              {t('events.create.address')}
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
              {t('events.create.googleMapsUrl')}
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
              {t('events.create.numberOfDays')}
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
                {t('events.create.daysWarning', { days: numberOfDays })}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('events.create.startDate')}
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
                {t('events.create.enterDaysFirst')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('events.create.endDate')}
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
                {t('events.create.endDateInfo')}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={mutation.isPending || !numberOfDays || !startDate || !endDate}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? t('events.create.submitting') : t('events.create.submit')}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateEvent;