declare module "react-dom" {
  export function useFormStatus(): { pending: boolean };
  export function useFormState<T>(
    action: (state: T, formData: FormData) => T,
    initialState: T,
  ): [T, (formData: FormData) => void];
}