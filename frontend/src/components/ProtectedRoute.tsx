import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requirePermission?: {
    resource: string;
    action: string;
  };
  requireRole?: string;
  requireFeature?: string;
  allowWithModuleAccess?: boolean; // Allow access if user has module assignments
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requirePermission,
  requireRole,
  requireFeature,
  allowWithModuleAccess = false,
}) => {
  const { isAuthenticated, isLoading, user, hasPermission, hasRole, canAccessFeature } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required permission
  if (requirePermission) {
    const { resource, action } = requirePermission;
    let hasAccess = hasPermission(resource, action);

    // If permission check fails but allowWithModuleAccess is true,
    // check if user has module assignments
    if (!hasAccess && allowWithModuleAccess) {
      hasAccess = user?.module_assignments && user.module_assignments.length > 0;
    }

    if (!hasAccess) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
            <div className="text-red-600 text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this resource.
            </p>
            <p className="text-sm text-gray-500">
              Required permission: <span className="font-mono">{resource}.{action}</span>
            </p>
          </div>
        </div>
      );
    }
  }

  // Check for required role
  if (requireRole && !hasRole(requireRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-600 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have the required role to access this resource.
          </p>
          <p className="text-sm text-gray-500">
            Required role: <span className="font-mono">{requireRole}</span>
          </p>
        </div>
      </div>
    );
  }

  // Check for required feature
  if (requireFeature && !canAccessFeature(requireFeature)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-red-600 text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have access to this area.
          </p>
          <p className="text-sm text-gray-500">
            Required feature: <span className="font-mono">{requireFeature}</span>
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
