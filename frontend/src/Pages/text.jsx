// useEffect(() => {
//     const getdatabyid = async (memberId) => {
//       try {
//         const response = await axios.get(
//           https://api.tranquility.org.ng/api/Member/GetMemberById/${memberId}
//         );
//         return response.data;
//       } catch (error) {
//         console.error(Error fetching data for ID ${memberId}:, error.message);
//       }
//     };

//     const fetchAllData = async () => {
//       if (data.length > 0) {
//         const result = await Promise.all(
//           data.map(async (item) => {
//             const additionalData = await getdatabyid(item.memberId);
//             return { ...item, ...additionalData };
//           })
//         );
//         setFetchedData(result);
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, [data]);