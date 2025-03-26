import {
  Dispatch,
  SetStateAction,
} from "react";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import { MenuFormSchema, menuSchema,MenuWithId } from "@/shcema/menuSchema";
import { Loader2 } from "lucide-react";
import { useMenuStore } from "@/store/useMenuStore";
import { DialogDescription } from "@radix-ui/react-dialog";


const DeleteMenu = ({menuId,deleteOpen,setDeleteOpen}:{
    menuId: string;
    deleteOpen: boolean;
  setDeleteOpen: Dispatch<SetStateAction<boolean>>;
}) => {

  const {loading, deleteMenu} = useMenuStore(); 


  const handleDelete = async () => {
    
         // api implementation for updating menu
    try {
      deleteMenu(menuId);
     setDeleteOpen(false);
    } catch (error:any ) {
 
    }
  }
  return (
    <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogDescription>
          Do you really want to delete this menu?
                </DialogDescription>
      </DialogHeader>
    
        <DialogFooter className="mt-5">
          {loading ? (
           <>
            <Button className="bg-gray-500 hover:bg-gray-700">
            No
          </Button>
          <Button  className="bg-red-500 hover:bg-red-700">
             <Loader2 className="mr-2 w-4 h-4 animate-spin" />
            Delete
          </Button>
          </>
          ) : (<>
            <Button onClick={()=>{setDeleteOpen(false)}} className="bg-gray-500 hover:bg-gray-700">
            No
          </Button>
          <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-700">
            Delete
          </Button>
          </>
          )}
        </DialogFooter>
      
    </DialogContent>
  </Dialog>
  )
}

export default DeleteMenu