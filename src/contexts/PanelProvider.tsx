import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ImperativePanelHandle, PanelOnResize } from "react-resizable-panels";
import { getDriveContext, setDriveContext } from "./resizeable-panels";

const EXPAND_SIZE_PIXEL = 250;
const COLLAPSE_SIZE_PIXEL = 75;

export default function PanelProvider(props: PropsWithChildren<unknown>) {
  const handleRef = useRef<ImperativePanelHandle>();
  const [handleConnected, setHandleConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [COLLAPSED_SIZE, setCollpasedSize] = useState(15);
  const [EXPAND_SIZE, setExpandedSize] = useState(20);

  const getWindowWidth = () => {
    if (!window) return 0;
    return window.innerWidth;
  };

  const getDimensions = useCallback(() => {
    let expandRatio = Math.floor(100 / (getWindowWidth() / EXPAND_SIZE_PIXEL));
    let collapseRatio = Math.floor(
      100 / (getWindowWidth() / COLLAPSE_SIZE_PIXEL)
    );
    return { expandRatio, collapseRatio };
  }, []);

  const attachHandle = useCallback(
    (handle: ImperativePanelHandle) => {
      if (!handle) return;
      handleRef.current = handle;
     
      setHandleConnected(true);

      const dimensions = getDimensions();
      setCollpasedSize(dimensions.collapseRatio);
      setExpandedSize(dimensions.expandRatio);

    //   handle.resize(dimensions.expandRatio);
    },
    [getDimensions]
  );

  const expand = useCallback(() => {
    if (!handleConnected) return;

    try {
      setIsOpen(() => true);

      const dimensions = getDimensions();
      setCollpasedSize(dimensions.collapseRatio);
      setExpandedSize(dimensions.expandRatio);
      handleRef.current?.expand();
    } catch (err) {
      // setTimeout(expand);
    }
  }, [getDimensions, handleConnected]);

  const collapse = useCallback(() => {
    if (!handleConnected) return;
    try {
      setIsOpen(() => false);

      const dimensions = getDimensions();
      setCollpasedSize(dimensions.collapseRatio);
      setExpandedSize(dimensions.expandRatio);
      handleRef.current?.collapse();
    } catch (err) {
      console.error("DrivePanel", err);
      // setTimeout(collapse);
    }
  }, [getDimensions, handleConnected]);

  const getSize = useCallback(() => {
    if (!handleConnected) return 0;
    return handleRef.current?.isExpanded() ? EXPAND_SIZE : COLLAPSED_SIZE;
  }, [COLLAPSED_SIZE, EXPAND_SIZE, handleConnected]);

  const onResize = useCallback(
    (size: number, prevSize?: number) => {
      // console.log("resize: ", { size, prevSize });
      if (!handleConnected) return 0;
      handleRef.current?.resize(size);

      if (size <= COLLAPSED_SIZE) {
        setIsOpen(() => false);
        handleRef.current?.collapse();
      } else {
        setIsOpen(() => true);
        handleRef.current?.expand();
      }
    },
    [COLLAPSED_SIZE, handleConnected]
  );

  const memoizedValue = useMemo(
    () => ({ collapse, expand, attachHandle, onResize, getSize }),
    [attachHandle, collapse, expand, getSize, onResize]
  );

  useEffect(() => {
    const dimensions = getDimensions();
    setCollpasedSize(dimensions.collapseRatio);
    setExpandedSize(dimensions.expandRatio);
  }, [getDimensions]);

  return (
    <getDriveContext.Provider value={{ isOpen, minSize: COLLAPSED_SIZE, maxSize: EXPAND_SIZE }}>
      <setDriveContext.Provider value={memoizedValue}>
        {props.children}
      </setDriveContext.Provider>
    </getDriveContext.Provider>
  );
}
