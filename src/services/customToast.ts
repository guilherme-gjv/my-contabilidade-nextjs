import { Id, ToastOptions, UpdateOptions, toast } from "react-toastify";

export const defaultOptions: ToastOptions<{}> = {
  position: toast.POSITION.BOTTOM_RIGHT,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  progressStyle: {
    color: "blue",
  },
};

export enum CustomToastTypes {
  INFO,
  WARNING,
  SUCCESS,
  ERROR,
  DEFAULT,
  LOADING,
}

export const customToast = (
  message: string,
  type: CustomToastTypes,
  options?: ToastOptions<{}>
) => {
  if (!options) {
    options = defaultOptions;
  }

  let toastId: Id;

  switch (type) {
    case CustomToastTypes.DEFAULT:
      toastId = toast(message, options);
    case CustomToastTypes.ERROR:
      toastId = toast.error(message, options);
    case CustomToastTypes.INFO:
      toastId = toast.info(message, options);
    case CustomToastTypes.SUCCESS:
      toastId = toast.success(message, options);
    case CustomToastTypes.WARNING:
      toastId = toast.warning(message, options);
    case CustomToastTypes.LOADING:
      toastId = toast(message, { ...options, isLoading: true });
  }

  const updateToast = (updateOptions: UpdateOptions) => {
    toast.update(toastId, updateOptions);
  };

  const removeToast = () => {
    toast.dismiss(toastId);
  };

  return { toastId, updateToast, removeToast };
};
