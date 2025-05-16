import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTeam } from '../context/TeamContext';
import { useAuth } from '../context/AuthContext';

export default function CreateTeam() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { createTeam } = useTeam();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      visibility: 'private' // 'private' or 'public'
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Team name is required')
        .min(3, 'Team name must be at least 3 characters')
        .max(50, 'Team name must be at most 50 characters'),
      description: Yup.string()
        .required('Team description is required')
        .min(10, 'Description must be at least 10 characters')
        .max(500, 'Description must be at most 500 characters'),
      visibility: Yup.string()
        .required('Visibility is required')
        .oneOf(['private', 'public'], 'Invalid visibility option')
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError(null);
      
      try {
        const newTeam = await createTeam({
          name: values.name,
          description: values.description,
          visibility: values.visibility,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(values.name)}&background=random`
        });
        
        // Navigate to the new team page
        navigate(`/teams/${newTeam.id}`);
      } catch (err) {
        setError(err.message || 'Failed to create team');
      } finally {
        setLoading(false);
      }
    }
  });

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.485 3.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 3.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                You need to be logged in to create a team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Create a New Team</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Team Name
          </label>
          <div className="mt-1">
            <input
              id="name"
              name="name"
              type="text"
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.name && formik.errors.name ? (
            <p className="mt-2 text-sm text-red-600">{formik.errors.name}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Team Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          {formik.touched.description && formik.errors.description ? (
            <p className="mt-2 text-sm text-red-600">{formik.errors.description}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Team Visibility
          </label>
          <div className="mt-4 space-y-4">
            <div className="flex items-center">
              <input
                id="visibility-private"
                name="visibility"
                type="radio"
                value="private"
                checked={formik.values.visibility === 'private'}
                onChange={formik.handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="visibility-private" className="ml-3 block text-sm font-medium text-gray-700">
                Private - Only visible to team members
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="visibility-public"
                name="visibility"
                type="radio"
                value="public"
                checked={formik.values.visibility === 'public'}
                onChange={formik.handleChange}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="visibility-public" className="ml-3 block text-sm font-medium text-gray-700">
                Public - Anyone can view team projects
              </label>
            </div>
          </div>
          {formik.touched.visibility && formik.errors.visibility ? (
            <p className="mt-2 text-sm text-red-600">{formik.errors.visibility}</p>
          ) : null}
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating Team...' : 'Create Team'}
          </button>
        </div>
      </form>
    </div>
  );
} 