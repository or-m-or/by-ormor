'use client';

import { useState } from 'react';
import { Alert } from '@/components/common/Alert';

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: formData.email,
          subject: `${formData.name}님의 메시지`,
          message: formData.message,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: result.message });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: `메일 전송 실패: ${result.message}` });
      }
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: '예기치 못한 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mx-auto mt-8 w-full max-w-2xl space-y-6'>
      <input
        type='email'
        name='email'
        placeholder='수신할 이메일을 입력해주세요'
        className='w-full rounded-xl border-0 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl'
        onChange={handleChange}
        value={formData.email}
        required
        disabled={isSubmitting}
      />
      <input
        type='text'
        name='name'
        placeholder='이름을 입력해주세요'
        className='w-full rounded-xl border-0 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl'
        onChange={handleChange}
        value={formData.name}
        required
        disabled={isSubmitting}
      />

      <textarea
        name='message'
        placeholder='메시지를 입력해주세요'
        className='h-40 w-full resize-none rounded-xl border-0 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 backdrop-blur-sm transition-all duration-300 shadow-lg hover:shadow-xl'
        onChange={handleChange}
        value={formData.message}
        required
        disabled={isSubmitting}
      />
      <button
        type='submit'
        className='group relative w-full p-[3px] disabled:opacity-50 disabled:cursor-not-allowed'
        disabled={isSubmitting}
      >
        <div className='absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75 blur-sm transition duration-300 group-hover:opacity-100' />
        <div className='relative z-10 w-full rounded-[6px] bg-black px-8 py-2 text-center text-white transition duration-200 group-hover:bg-transparent'>
          {isSubmitting ? '전송 중...' : 'SUBMIT'}
        </div>
      </button>
      {status && <Alert type={status.type} message={status.message} />}
    </form>
  );
}; 