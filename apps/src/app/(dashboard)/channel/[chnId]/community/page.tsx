export const instant = false;

const page = async ({ params }: { params: Promise<{ chnId: string }> }) => {
  const { chnId } = await params;
  return (
    <div className="px-2 space-y-10 py-4 h-90 flex-1 flex items-center justify-center">
      <h2>Comming soon</h2>
    </div>
  );
};

export default page;
