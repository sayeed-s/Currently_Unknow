export const instant = false;

const page = async ({ params }: { params: Promise<{ chnId: string }> }) => {
  const { chnId } = await params;
  return (
    <div className="px-2 space-y-10 py-4">
      <h2>Community page {chnId}</h2>
    </div>
  );
};

export default page;
