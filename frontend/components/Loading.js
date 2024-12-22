import { ClipLoader } from 'react-spinners';

export const LoadingFullPageSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
      <ClipLoader size={50} color="#ffffff" />
    </div>
  );
};

export const LoadingComponent = () => {
  return (
    <div className="flex justify-center items-center z-50 py-5">
      <ClipLoader size={40} color="#dddddd" />
    </div>
  );
}