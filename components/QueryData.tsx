import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { getProductByBarcode } from '../api/api';

export default function QueryData({
  barcode,
  removeBarCode,
}: {
  barcode: string;
  removeBarCode: () => void;
}) {
  const query = useQuery(`barCodeProduct-${barcode}`, async () => getProductByBarcode(barcode), {
    enabled: !!barcode,
  });

  useEffect(() => {
    if (query.data) {
      removeBarCode();
      alert(JSON.stringify(query.data));
    }
  }, [query.data]);

  return null;
}
